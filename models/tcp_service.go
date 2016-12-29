package models

import "time"

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
