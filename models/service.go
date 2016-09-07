package models

import "time"

const (
	Greater  = ">"
	Less     = "<"
	Equal    = "=="
	NotEqual = "!="
)

type Service struct {
	ID            int    `gorm:"primary_key"`
	AlertID       int    `gorm:"not null"`
	Name          string `gorm:"type:varchar(64);not null"`
	Metric        string `gorm:"type:varchar(1024);not null"`
	CheckAttempts int    `gorm:"not null; default 3"`
	Warning       string `gorm:"type:varchar(32);not null"`
	Critical      string `gorm:"type:varchar(32);not null"`
	Enabled       bool   `gorm:"not null"`
	ResendTime    int    `gorm:"not null"`
	CheckType     string `gorm:"type:varchar(16);not null"`
	CreatedAt     time.Time

	Alert Alert `gorm:"ForeignKey:AlertID"`
}

func GetAllServicesByAlertID(alertID int, services *[]Service) error {
	return db.Find(services, "alert_id = ?", alertID).Error
}

func GetService(serviceID int, service *Service) error {
	return db.First(service, serviceID).Error
}

func SaveService(service *Service) error {
	return db.Save(service).Error
}

func DeleteService(serviceID int) error {
	return db.Delete(Service{}, serviceID).Error
}

func IsServiceDuplicated(name string, alertID, serviceID int) bool {
	var count int
	err := db.Model(&Service{}).Where("name = ? and alert_id = ? and id <> ?", name, alertID, serviceID).Count(&count).Error
	return count != 0 || err != nil
}
