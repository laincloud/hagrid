package models

import (
	"time"
)

type Template struct {
	ID        int    `gorm:"primary_key" form:"-"`
	AlertID   int    `gorm:"not null" form:"-"`
	Name      string `gorm:"type:varchar(64);not null" form:"name"`
	Values    string `gorm:"type:text;not null" form:"values"`
	Alert     Alert  `gorm:"ForeignKey:AlertID" form:"-"`
	CreatedAt time.Time
}

func GetAllTemplatesByAlertID(alertID int, templates *[]Template) error {
	return db.Find(templates, "alert_id = ?", alertID).Error
}

func GetTemplate(templateID int, template *Template) error {
	return db.First(template, templateID).Error
}

func SaveTemplate(template *Template) error {
	if isTemplateDuplicated(template) {
		return ErrorDuplicatedName
	}
	return db.Save(template).Error
}

func DeleteTemplate(templateID, alertID int) error {
	return db.Delete(Template{}, "id = ? AND alert_id = ?", templateID, alertID).Error
}

func isTemplateDuplicated(template *Template) bool {
	var count int
	err := db.Model(&Template{}).Where("name = ? and alert_id = ? and id <> ?", template.Name, template.AlertID, template.ID).Count(&count).Error
	return count != 0 || err != nil
}
