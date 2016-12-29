package models

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/laincloud/hagrid/config"
)

type Alert struct {
	ID               int               `gorm:"primary_key" form:"-"`
	Name             string            `gorm:"type:varchar(64);not null;unique" form:"name"`
	Enabled          bool              `gorm:"not null" form:"enabled"`
	GraphiteServices []GraphiteService `gorm:"ForeignKey:AlertID" form:"-"`
	TCPServices      []TCPService      `gorm:"ForeignKey:AlertID" form:"-"`
	Templates        []Template        `gorm:"ForeignKey:AlertID" form:"-"`
	Notifiers        []User            `gorm:"many2many:alert_to_user_notify" form:"-"`
	Admins           []User            `gorm:"many2many:alert_to_user_admin" form:"-"`

	CreatedAt time.Time `form:"-"`
}

type Icinga2Apply struct {
	Name             string
	NotificationType string
	Users            string
	ServiceName      string
	Interval         int
}

type Icinga2Service struct {
	ID            string
	Name          string
	Warning       string
	Critical      string
	CheckAttempts int
	ResendTime    int
	MetricURL     string
	MetricType    string
}

var metricType = map[string]string{
	Greater:  "greater",
	Less:     "less",
	NotEqual: "notequal",
	Equal:    "equal",
}

func (s *Icinga2Service) generateApplies(notifiersStr string) []Icinga2Apply {
	var icinga2Applies []Icinga2Apply
	for _, notificationType := range config.GetIcinga2NotificationTypes() {
		newNotification := Icinga2Apply{
			Name:             fmt.Sprintf("%s[%s]", s.Name, notificationType),
			NotificationType: notificationType,
			Users:            notifiersStr,
			ServiceName:      s.Name,
			Interval:         60 * s.ResendTime, //The metric of interval is second here
		}
		icinga2Applies = append(icinga2Applies, newNotification)
	}
	return icinga2Applies
}

func (al *Alert) generateIcinga2Config() ([]Icinga2Apply, []Icinga2Service) {
	notifiersList := make([]string, 0, len(al.Notifiers))
	for _, notifier := range al.Notifiers {
		notifiersList = append(notifiersList, notifier.Name)
	}
	notifiersBytes, _ := json.Marshal(notifiersList)
	notifiersStr := string(notifiersBytes)
	var icinga2Applies []Icinga2Apply
	var icinga2Services []Icinga2Service
	for _, service := range al.GraphiteServices {
		if service.Enabled {
			if !strings.ContainsRune(service.Metric, '$') {
				// This service is not using template
				newService := Icinga2Service{
					ID:            strconv.Itoa(service.ID),
					Name:          fmt.Sprintf("%s-%s", al.Name, service.Name),
					Warning:       service.Warning,
					Critical:      service.Critical,
					CheckAttempts: service.CheckAttempts,
					ResendTime:    service.ResendTime,
					MetricURL:     fmt.Sprintf("%s/render?target=%s", config.GetSource(), service.Metric),
					MetricType:    metricType[service.CheckType],
				}
				icinga2Services = append(icinga2Services, newService)
				icinga2Applies = append(icinga2Applies, newService.generateApplies(notifiersStr)...)

			} else {
				// This service is using template
				for _, tmpl := range al.Templates {
					replacedStr := "$" + strings.TrimSpace(tmpl.Name)
					if strings.Contains(service.Metric, replacedStr+".") || strings.HasSuffix(service.Metric, replacedStr) {
						for _, value := range strings.Split(tmpl.Values, ",") {
							trimedValue := strings.TrimSpace(value)
							if trimedValue != "" {
								realMetric := strings.Replace(service.Metric, replacedStr, trimedValue, -1)
								newService := Icinga2Service{
									ID:            fmt.Sprintf("%d-%d-%s", service.ID, tmpl.ID, trimedValue),
									Name:          fmt.Sprintf("%s-%s[%s]", al.Name, service.Name, trimedValue),
									Warning:       service.Warning,
									Critical:      service.Critical,
									CheckAttempts: service.CheckAttempts,
									ResendTime:    service.ResendTime,
									MetricURL:     fmt.Sprintf("%s/render?target=%s", config.GetSource(), realMetric),
									MetricType:    metricType[service.CheckType],
								}
								icinga2Services = append(icinga2Services, newService)
								icinga2Applies = append(icinga2Applies, newService.generateApplies(notifiersStr)...)
							}
						}
					}
				}
			}
		}
	}
	return icinga2Applies, icinga2Services
}

func SaveAlert(alert *Alert) error {
	if isAlertDuplicated(alert) {
		return ErrorDuplicatedName
	}
	return db.Save(alert).Error
}

func DeleteAlert(alertID int) error {
	return db.Delete(Alert{}, "id = ?", alertID).Error
}

func GetAlert(alert *Alert, id int) error {
	return db.First(alert, id).Error
}

func GetAllAlerts(alerts *[]Alert) error {
	return db.Find(alerts).Error
}

func isAlertDuplicated(alert *Alert) bool {
	var count int
	err := db.Model(&Alert{}).Where("id <> ? AND name = ?", alert.ID, alert.Name).Count(&count).Error
	return count != 0 || err != nil
}

func GetDetailedAlert(alert *Alert, id int) error {
	if err := GetAlert(alert, id); err != nil {
		return err
	}
	if err := db.Model(alert).Association("GraphiteServices").Find(&(alert.GraphiteServices)).Error; err != nil {
		return err
	}
	if err := db.Model(alert).Association("TCPServices").Find(&(alert.TCPServices)).Error; err != nil {
		return err
	}
	if err := db.Model(alert).Association("Templates").Find(&(alert.Templates)).Error; err != nil {
		return err
	}
	if err := db.Model(alert).Association("Notifiers").Find(&(alert.Notifiers)).Error; err != nil {
		return err
	}
	if err := db.Model(alert).Association("Admins").Find(&(alert.Admins)).Error; err != nil {
		return err
	}
	return nil
}

func SynchronizeAlert(id int) error {
	syncLock.Lock()
	defer syncLock.Unlock()
	var (
		appliesFile  string
		servicesFile string
		err          error
		newStage     string
	)
	alert := &Alert{}
	if err = GetDetailedAlert(alert, id); err != nil {
		return err
	}
	pkgName := alertPackagePrefix + strconv.Itoa(id)
	// If the alert is not enabled, nothing will sync to icinga2, we only need to remove the package
	if !alert.Enabled || config.GetSource() == "" {
		icinga2Client.DeletePackage(pkgName)
		return nil
	}
	icinga2Client.CreatePackage(pkgName)
	icinga2Applies, icinga2Services := alert.generateIcinga2Config()
	appliesFile, err = renderTemplate("applies.tmpl", map[string][]Icinga2Apply{"Applies": icinga2Applies})
	if err != nil {
		return err
	}
	servicesFile, err = renderTemplate("services.tmpl", map[string][]Icinga2Service{"Services": icinga2Services})
	if err != nil {
		return err
	}

	files := make(map[string]string)
	files["conf.d/applies.conf"] = appliesFile
	files["conf.d/services.conf"] = servicesFile
	if newStage, err = icinga2Client.UploadFiles(pkgName, files); err != nil {
		return err
	}

	// Clear old packages
	pkg, _ := icinga2Client.GetPackage(pkgName)
	if pkg != nil {
		for _, stage := range pkg.Stages {
			if stage != newStage && stage != pkg.ActiveStage {
				icinga2Client.DeleteStage(pkgName, stage)
			}
		}
	}
	return nil
}
