package models

import (
	"time"
)

type Template struct {
	ID        int    `gorm:"primary_key"`
	AlertID   int    `gorm:"not null"`
	Name      string `gorm:"type:varchar(64);not null"`
	Values    string `gorm:"type:text;not null"`
	Alert     Alert  `gorm:"ForeignKey:AlertID"`
	CreatedAt time.Time
}

func GetAllTemplatesByAlertID(alertID int, templates *[]Template) error {
	return db.Find(templates, "alert_id = ?", alertID).Error
}

func GetTemplate(templateID int, template *Template) error {
	return db.First(template, templateID).Error
}

func SaveTemplate(template *Template) error {
	return db.Save(template).Error
}

func DeleteTemplate(templateID int) error {
	return db.Delete(Template{}, templateID).Error
}

func IsTemplateDuplicated(name string, alertID int) bool {
	var count int
	err := db.Model(&Template{}).Where("name = ? and alert_id = ?", name, alertID).Count(&count).Error
	return count != 0 || err != nil
}
