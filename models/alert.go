package models

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/laincloud/hagrid/config"
	"github.com/mijia/sweb/log"
)

type Alert struct {
	ID        int        `gorm:"primary_key"`
	Name      string     `gorm:"type:varchar(64);not null;unique"`
	Enabled   bool       `gorm:"not null"`
	Services  []Service  `gorm:"ForeignKey:AlertID"`
	Templates []Template `gorm:"ForeignKey:AlertID"`
	Notifiers []User     `gorm:"many2many:alert_to_user_notify"`
	Admins    []User     `gorm:"many2many:alert_to_user_admin"`

	CreatedAt time.Time
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
	for _, service := range al.Services {
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
					if strings.Contains(service.Metric, replacedStr) {
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
	if err := db.Save(alert).Error; err != nil {
		log.Errorf("Saving alert failed: %s", err.Error())
		return fmt.Errorf("Saving alert failed. Ask admin for help")
	}
	return nil
}

func DeleteAlert(id int) error {
	if err := db.Delete(Alert{}, "id = ?", id).Error; err != nil {
		log.Errorf("Deleting alert failed: %s", err.Error())
		return fmt.Errorf("Deleting alert failed. Ask admin for help")
	}
	return nil
}

func GetAlert(alert *Alert, id int) error {
	if err := db.First(alert, id).Error; err != nil {
		log.Errorf("Getting alert %d failed: %s", id, err.Error())
		return fmt.Errorf("Getting alert failed. Ask admin for help")
	}
	return nil
}

func GetAllAlerts(alerts *[]Alert) error {
	if err := db.Find(alerts).Error; err != nil {
		log.Errorf("Getting all alerts failed: %s", err.Error())
		return fmt.Errorf("Getting all alerts failed. Ask admin for help")
	}
	return nil
}

func IsAlertDuplicated(name string) bool {
	var count int
	err := db.Model(&Alert{}).Where("name = ?", name).Count(&count).Error
	return count != 0 || err != nil
}

func GetDetailedAlert(alert *Alert, id int) error {
	if err := GetAlert(alert, id); err != nil {
		return err
	}
	if err := db.Model(alert).Association("Services").Find(&(alert.Services)).Error; err != nil {
		log.Errorf("Getting associated services of %d failed: %s", id, err.Error())
		return fmt.Errorf("Getting associated services failed. Ask admin for help")
	}
	if err := db.Model(alert).Association("Templates").Find(&(alert.Templates)).Error; err != nil {
		log.Errorf("Getting associated templates of %d failed: %s", id, err.Error())
		return fmt.Errorf("Getting associated templates failed. Ask admin for help")
	}
	if err := db.Model(alert).Association("Notifiers").Find(&(alert.Notifiers)).Error; err != nil {
		log.Errorf("Getting associated notifiers of %d failed: %s", id, err.Error())
		return fmt.Errorf("Getting notifiers services failed. Ask admin for help")
	}
	if err := db.Model(alert).Association("Admins").Find(&(alert.Admins)).Error; err != nil {
		log.Errorf("Getting associated admins of %d failed: %s", id, err.Error())
		return fmt.Errorf("Getting associated admins failed. Ask admin for help")
	}
	return nil
}

func SynchronizeAlert(id int) error {
	syncLock.Lock()
	defer syncLock.Unlock()
	var (
		appliesFile       string
		servicesFile      string
		commandsFile      string
		notificationsFile string
		err               error
		newStage          string
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
		log.Errorf("Rendering template applies.tmpl failed: %s", err.Error())
		return fmt.Errorf("Rendering template failed. Ask admin for help")
	}
	servicesFile, err = renderTemplate("services.tmpl", map[string][]Icinga2Service{"Services": icinga2Services})
	if err != nil {
		log.Errorf("Rendering template services.tmpl failed: %s", err.Error())
		return fmt.Errorf("Rendering template failed. Ask admin for help")
	}
	placeHolder := ""
	commandsFile, _ = renderTemplate("commands.tmpl", placeHolder)
	notificationsFile, _ = renderTemplate("notifications.tmpl", placeHolder)

	files := make(map[string]string)
	files["conf.d/applies.conf"] = appliesFile
	files["conf.d/services.conf"] = servicesFile
	files["conf.d/commands.conf"] = commandsFile
	files["conf.d/notifications.conf"] = notificationsFile
	if newStage, err = icinga2Client.UploadFiles(pkgName, files); err != nil {
		log.Errorf("Uploading alert config files failed: %s", err.Error())
		return fmt.Errorf("Uploading alert config files failed. Ask admin for help")
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
