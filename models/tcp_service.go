package models

import (
	"fmt"
	"strings"
	"time"
)

const TCPServiceCheckCommand = "check_tcp"

type TCPService struct {
	ID            int    `gorm:"primary_key" form:"-"`
	AlertID       int    `gorm:"not null" form:"-"`
	Name          string `gorm:"type:varchar(64);not null" form:"name"`
	Host          string `gorm:"type:varchar(64);not null" form:"host"`
	Port          int    `gorm:"not null;" form:"port"`
	CheckAttempts int    `gorm:"not null; default 3" form:"check_attempts"`
	Enabled       bool   `gorm:"not null" form:"enabled"`
	ResendTime    int    `gorm:"not null" form:"resend_time"`
	CreatedAt     time.Time

	Alert Alert `gorm:"ForeignKey:AlertID"`
}

func GetAllTCPServicesByAlertID(alertID int, services *[]TCPService) error {
	return db.Find(services, "alert_id = ?", alertID).Error
}

func GetTCPService(serviceID int, service *TCPService) error {
	return db.First(service, serviceID).Error
}

func SaveTCPService(service *TCPService) error {
	if isTCPServiceDuplicated(service) {
		return ErrorDuplicatedName
	}
	return db.Save(service).Error
}

func DeleteTCPService(serviceID, alertID int) error {
	return db.Delete(TCPService{}, "id = ? AND alert_id = ?", serviceID, alertID).Error
}

func isTCPServiceDuplicated(service *TCPService) bool {
	var count int
	err := db.Model(&TCPService{}).Where("name = ? AND alert_id = ? AND id <> ?",
		service.Name, service.AlertID, service.ID).Count(&count).Error
	return count != 0 || err != nil
}

func (tcps *TCPService) GenerateServices(templates []Template) []Icinga2Service {
	var services []Icinga2Service
	if tcps.Enabled {
		if !strings.ContainsRune(tcps.Host, '$') {
			// This service is not using template
			newService := Icinga2TCPService{
				ID:            fmt.Sprintf("[TCPService]%d", tcps.ID),
				Name:          fmt.Sprintf("[TCPService]%s-%s", tcps.Alert.Name, tcps.Name),
				Host:          tcps.Host,
				Port:          tcps.Port,
				CheckAttempts: tcps.CheckAttempts,
				ResendTime:    tcps.ResendTime,
			}
			services = append(services, newService)
		} else {
			// This service is using template
			for _, tmpl := range templates {
				replacedStr := "$" + strings.TrimSpace(tmpl.Name)
				if strings.Contains(tcps.Host, replacedStr+".") || strings.HasSuffix(tcps.Host, replacedStr) {
					for _, value := range strings.Split(tmpl.Values, ",") {
						trimedValue := strings.TrimSpace(value)
						if trimedValue != "" {
							realHost := strings.Replace(tcps.Host, replacedStr, trimedValue, -1)
							newService := Icinga2TCPService{
								ID:            fmt.Sprintf("[TCPService]%d-%d-%s", tcps.ID, tmpl.ID, trimedValue),
								Name:          fmt.Sprintf("[TCPService]%s-%s[%s]", tcps.Alert.Name, tcps.Name, trimedValue),
								Host:          realHost,
								Port:          tcps.Port,
								CheckAttempts: tcps.CheckAttempts,
								ResendTime:    tcps.ResendTime,
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
type Icinga2TCPService struct {
	ID            string
	Name          string
	Host          string
	Port          int
	CheckAttempts int
	ResendTime    int
}

func (tcpS Icinga2TCPService) GetServiceID() string {
	return tcpS.ID
}

func (tcpS Icinga2TCPService) GetServiceName() string {
	return tcpS.Name
}

func (tcpS Icinga2TCPService) GetServiceCheckCommand() string {
	return TCPServiceCheckCommand
}

func (tcpS Icinga2TCPService) GetServiceCheckAttempts() int {
	return tcpS.CheckAttempts
}

func (tcpS Icinga2TCPService) GetServiceResendTime() int {
	return tcpS.ResendTime
}

func (tcpS Icinga2TCPService) GetServiceVars() map[string]interface{} {
	return map[string]interface{}{
		"metric_host": tcpS.Host,
		"metric_port": tcpS.Port,
	}
}

func (tcpS Icinga2TCPService) GetServiceNonStrVars() map[string]interface{} {
	return map[string]interface{}{}
}
