package models

import (
	"bytes"
	"crypto/tls"
	"fmt"
	"net/http"
	"path/filepath"
	"sync"
	"text/template"
	"time"

	"github.com/jinzhu/gorm"
	"github.com/laincloud/hagrid/config"
	"github.com/laincloud/hagrid/icinga2"
)

const (
	userPackage        = "hagrid_user"
	alertPackagePrefix = "hagrid_alert_"
)

var (
	db            *gorm.DB
	icinga2Client icinga2.Icinga2Client
	syncLock      *sync.Mutex
)

func init() {
	var err error
	if db, err = gorm.Open("mysql",
		fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8&parseTime=True",
			config.GetDatabaseUser(),
			config.GetDatabasePassword(),
			config.GetDatabaseHost(),
			config.GetDatabasePort(),
			config.GetDatabaseName(),
		)); err != nil {
		panic(err)
	}

	db.LogMode(config.GetDatabaseDebug())

	if config.GetDatabaseMigrate() {
		db.Set("gorm:table_options", "ENGINE=InnoDB DEFAULT CHARSET=utf8").AutoMigrate(
			&User{}, &Alert{}, &Service{}, &Template{},
		)
		db.Model(&Service{}).AddForeignKey("alert_id", "alerts(id)", "CASCADE", "RESTRICT")
		db.Table("alert_to_user_admin").AddForeignKey("alert_id", "alerts(id)", "CASCADE", "RESTRICT")
		db.Table("alert_to_user_admin").AddForeignKey("user_id", "users(id)", "CASCADE", "RESTRICT")
		db.Table("alert_to_user_notify").AddForeignKey("alert_id", "alerts(id)", "CASCADE", "RESTRICT")
		db.Table("alert_to_user_notify").AddForeignKey("user_id", "users(id)", "CASCADE", "RESTRICT")
		db.Model(&Template{}).AddUniqueIndex("unique_alert_template", "alert_id", "name")
	}

	icinga2Client.Address = config.GetIcinga2APIAddress()
	icinga2Client.Client = &http.Client{
		Timeout: time.Second * 3,
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}
	icinga2Client.User = config.GetIcinga2APIUser()
	icinga2Client.Password = config.GetIcinga2APIPassword()

	syncLock = &sync.Mutex{}
	syncLock.Lock()
	icinga2Client.CreatePackage(userPackage)
	syncLock.Unlock()

}

func renderTemplate(templateName string, data interface{}) (string, error) {
	tmpl, err := template.ParseFiles(filepath.Join("templates", templateName))
	if err != nil {
		return "", err
	}
	var doc bytes.Buffer
	if err = tmpl.Execute(&doc, data); err != nil {
		return "", err
	}
	return doc.String(), nil
}
