package models

import "time"

const (
	Greater  = ">"
	Less     = "<"
	Equal    = "=="
	NotEqual = "!="
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
