package models

import (
	"fmt"
	"strings"
	"time"

	"github.com/laincloud/hagrid/config"
)

const (
	Greater  = ">"
	Less     = "<"
	Equal    = "=="
	NotEqual = "!="

	GraphiteServiceCheckCommand = "check_graphite_metric"
)

type GraphiteService struct {
	ID            int    `gorm:"primary_key" form:"-"`
	AlertID       int    `gorm:"not null" form:"-"`
	Name          string `gorm:"type:varchar(64);not null" form:"name"`
	Metric        string `gorm:"type:varchar(1024);not null" form:"metric"`
	CheckAttempts int    `gorm:"not null; default 3" form:"check_attempts"`
	Warning       string `gorm:"type:varchar(32);not null" form:"warning"`
	Critical      string `gorm:"type:varchar(32);not null" form:"critical"`
	Enabled       bool   `gorm:"not null" form:"enabled"`
	ResendTime    int    `gorm:"not null" form:"resend_time"`
	CheckType     string `gorm:"type:varchar(16);not null" form:"check_type"`
	CreatedAt     time.Time

	Alert Alert `gorm:"ForeignKey:AlertID"`
}

func GetAllGraphiteServicesByAlertID(alertID int, services *[]GraphiteService) error {
	return db.Find(services, "alert_id = ?", alertID).Error
}

func GetGraphiteService(serviceID int, service *GraphiteService) error {
	return db.First(service, serviceID).Error
}

func SaveGraphiteService(service *GraphiteService) error {
	if isGraphiteServiceDuplicated(service) {
		return ErrorDuplicatedName
	}
	return db.Save(service).Error
}

func DeleteGraphiteService(serviceID, alertID int) error {
	return db.Delete(GraphiteService{}, "id = ? AND alert_id = ?", serviceID, alertID).Error
}

func isGraphiteServiceDuplicated(service *GraphiteService) bool {
	var count int
	err := db.Model(&GraphiteService{}).Where("name = ? AND alert_id = ? AND id <> ?",
		service.Name, service.AlertID, service.ID).Count(&count).Error
	return count != 0 || err != nil
}

func (gs *GraphiteService) GenerateServices(templates []Template) []Icinga2Service {
	var services []Icinga2Service
	if gs.Enabled {
		if !strings.ContainsRune(gs.Metric, '$') {
			// This service is not using template
			newService := Icinga2GraphiteService{
				ID:            fmt.Sprintf("[GraphiteService]%d", gs.ID),
				Name:          fmt.Sprintf("[GraphiteService]%s-%s", gs.Alert.Name, gs.Name),
				Warning:       gs.Warning,
				Critical:      gs.Critical,
				CheckAttempts: gs.CheckAttempts,
				ResendTime:    gs.ResendTime,
				MetricURL:     fmt.Sprintf("%s/render?target=%s", config.GetSource(), gs.Metric),
				MetricType:    metricType[gs.CheckType],
			}
			services = append(services, newService)
		} else {
			// This service is using template
			for _, tmpl := range templates {
				replacedStr := "$" + strings.TrimSpace(tmpl.Name)
				if strings.Contains(gs.Metric, replacedStr+".") || strings.HasSuffix(gs.Metric, replacedStr) {
					for _, value := range strings.Split(tmpl.Values, ",") {
						trimedValue := strings.TrimSpace(value)
						if trimedValue != "" {
							realMetric := strings.Replace(gs.Metric, replacedStr, trimedValue, -1)
							newService := Icinga2GraphiteService{
								ID:            fmt.Sprintf("[GraphiteService]%d-%d-%s", gs.ID, tmpl.ID, trimedValue),
								Name:          fmt.Sprintf("[GraphiteService]%s-%s[%s]", gs.Alert.Name, gs.Name, trimedValue),
								Warning:       gs.Warning,
								Critical:      gs.Critical,
								CheckAttempts: gs.CheckAttempts,
								ResendTime:    gs.ResendTime,
								MetricURL:     fmt.Sprintf("%s/render?target=%s", config.GetSource(), realMetric),
								MetricType:    metricType[gs.CheckType],
							}
							services = append(services, newService)
						}
					}
				}
			}
		}
	}
	return services
}

// Implements Icinga2Service
type Icinga2GraphiteService struct {
	ID            string
	Name          string
	Warning       string
	Critical      string
	CheckAttempts int
	ResendTime    int
	MetricURL     string
	MetricType    string
}

func (gs Icinga2GraphiteService) GetServiceID() string {
	return gs.ID
}

func (gs Icinga2GraphiteService) GetServiceName() string {
	return gs.Name
}

func (gs Icinga2GraphiteService) GetServiceCheckCommand() string {
	return GraphiteServiceCheckCommand
}

func (gs Icinga2GraphiteService) GetServiceCheckAttempts() int {
	return gs.CheckAttempts
}

func (gs Icinga2GraphiteService) GetServiceResendTime() int {
	return gs.ResendTime
}

func (gs Icinga2GraphiteService) GetServiceVars() map[string]interface{} {
	return map[string]interface{}{
		"metric_warning":  gs.Warning,
		"metric_critical": gs.Critical,
		"metric_url":      gs.MetricURL,
		"metric_type":     gs.MetricType,
	}
}

func (gs Icinga2GraphiteService) GetServiceNonStrVars() map[string]interface{} {
	return map[string]interface{}{}
}
