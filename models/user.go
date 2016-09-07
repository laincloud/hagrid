package models

import (
	"fmt"
	"time"

	"github.com/laincloud/hagrid/config"
	"github.com/mijia/sweb/log"
)

type User struct {
	ID               int    `gorm:"primary_key:true"`
	Name             string `gorm:"type:varchar(64);not null;unique"`
	EmailAddress     string `gorm:"type:varchar(64);not null"`
	PhoneNumber      string `gorm:"type:varchar(64);not null"`
	BearychatTeam    string `gorm:"type:varchar(64);not null"`
	BearychatToken   string `gorm:"type:varchar(64);not null"`
	BearychatChannel string `gorm:"type:varchar(64);not null"`
	PushbulletToken  string `gorm:"type:varchar(64);not null"`
	SlackTeam        string `gorm:"type:varchar(64);not null"`
	SlackToken       string `gorm:"type:varchar(64);not null"`
	SlackChannel     string `gorm:"type:varchar(64);not null"`
	CreatedAt        time.Time

	AdminedAlerts  []Alert `gorm:"many2many:alert_to_user_admin"`
	NotifiedAlerts []Alert `gorm:"many2many:alert_to_user_notify"`
}

func AddUserIfNotExists(name string) error {
	maybeNewUser := &User{
		Name: name,
	}
	syncLock.Lock()
	defer syncLock.Unlock()
	if err := db.FirstOrCreate(maybeNewUser, maybeNewUser).Error; err != nil {
		log.Errorf("Adding user failed: %s", err.Error())
		return fmt.Errorf("Adding user failed. Ask admin for help")
	}
	return nil
}

func UpdateUser(user *User) error {
	syncLock.Lock()
	defer syncLock.Unlock()
	if err := db.Save(user).Error; err != nil {
		log.Errorf("Saving user failed: %s", err.Error())
		return fmt.Errorf("Saving user failed. Ask admin for help")
	}
	if err := renderUsers(); err != nil {
		log.Errorf("Rendering users failed: %s", err.Error())
		return fmt.Errorf("Rendering user failed. Ask admin for help")
	}
	return nil
}

func GetUser(userName string, user *User) error {
	if err := db.First(user, "name = ?", userName).Error; err != nil {
		log.Errorf("Getting user failed: %s", err.Error())
		return fmt.Errorf("Getting user failed. Ask admin for help")
	}
	if err := db.Model(&user).Association("AdminedAlerts").Find(&(user.AdminedAlerts)).Error; err != nil {
		log.Errorf("Getting user's admined alerts failed: %s", err.Error())
		return fmt.Errorf("Getting user's admined alerts failed. Ask admin for help")
	}
	// if err := db.Model(&user).Association("NotifiedAlerts").Find(&(user.NotifiedAlerts)).Error; err != nil {
	// 	log.Errorf("Getting user's notified alerts failed: %s", err.Error())
	// 	return fmt.Errorf("Getting user's notified alerts failed. Ask admin for help")
	// }
	return nil
}

func GetAllUsers(users *[]User, namePattern string) error {
	if err := db.Select("id, name").Where("name LIKE ? AND name <> ?", namePattern, config.GetSuperUser()).Find(users).Error; err != nil {
		log.Errorf("Getting all users with pattern %s failed: %s", namePattern, err.Error())
		return fmt.Errorf("Getting all users failed. Ask admin for help")
	}
	return nil
}

func GetAllUsersDetails(users *[]User, namePattern string) error {
	if err := db.Where("name LIKE ?", namePattern).Find(users).Error; err != nil {
		log.Errorf("Getting all users' details with pattern %s failed: %s", namePattern, err.Error())
		return fmt.Errorf("Getting all users' details failed. Ask admin for help")
	}
	return nil
}

func GetNotifiersByAlertID(id int, notifiers *[]User) error {
	if err := db.Model(&Alert{ID: id}).Association("Notifiers").Find(notifiers).Error; err != nil {
		log.Errorf("Getting all notifiers of alert %d failed: %s", id, err.Error())
		return fmt.Errorf("Getting all notifiers failed. Ask admin for help")
	}
	return nil
}

func DeleteNotifier(alertID, notifierID int) error {
	if err := db.Exec("DELETE FROM `alert_to_user_notify` where alert_id = ? and user_id = ?", alertID, notifierID).Error; err != nil {
		log.Errorf("Deleting notifier %d of %d failed: %s", notifierID, alertID, err.Error())
		return fmt.Errorf("Deleting notifier failed. Ask admin for help")
	}
	return nil
}

func AddNotifier(alertID, notifierID int) error {
	if err := db.Exec("INSERT INTO `alert_to_user_notify`(alert_id, user_id) values(?, ?)", alertID, notifierID).Error; err != nil {
		log.Errorf("Adding notifier %d of %d failed: %s", notifierID, alertID, err.Error())
		return fmt.Errorf("Adding notifier failed. Ask admin for help")
	}
	return nil
}

func IsNotifierDuplicated(alertID, notifierID int) bool {
	var count int
	err := db.Table("alert_to_user_notify").Where("alert_id = ? and user_id = ?", alertID, notifierID).Count(&count)
	return count != 0 || err != nil
}

func GetAdminsByAlertID(id int, admins *[]User) error {
	if err := db.Model(&Alert{ID: id}).Select("id, name").Association("Admins").Find(admins).Error; err != nil {
		log.Errorf("Getting admins of alert %d failed: %s", id, err.Error())
		return fmt.Errorf("Getting admins failed. Ask admin for help")
	}
	return nil
}

func DeleteAdmin(alertID, adminID int) error {
	if err := db.Exec("DELETE FROM `alert_to_user_admin` where alert_id = ? and user_id = ?", alertID, adminID).Error; err != nil {
		log.Errorf("Deleting admin %d of alert %d failed: %s", alertID, adminID, err.Error())
		return fmt.Errorf("Deleting admin failed. Ask admin for help")
	}
	return nil
}

func AddAdmin(alertID, adminID int) error {
	if err := db.Exec("INSERT INTO `alert_to_user_admin`(alert_id, user_id) values(?, ?)", alertID, adminID).Error; err != nil {
		log.Errorf("Adding admin %d of alert %d failed: %s", alertID, adminID, err.Error())
		return fmt.Errorf("Adding admin failed. Ask admin for help")
	}
	return nil
}

func IsAdminDuplicated(alertID, adminID int) bool {
	var count int
	err := db.Table("alert_to_user_admin").Where("alert_id = ? and user_id = ?", alertID, adminID).Count(&count)
	return count != 0 || err != nil
}

func renderUsers() error {
	var (
		users          []User
		err            error
		data, newStage string
	)
	if err = GetAllUsersDetails(&users, "%%%%"); err != nil {
		return err
	}
	data, err = renderTemplate("users.tmpl", map[string][]User{"Users": users})
	if err != nil {
		return err
	}
	if newStage, err = icinga2Client.UploadFiles(userPackage,
		map[string]string{
			"conf.d/user.conf": data,
		}); err != nil {
		return err
	}
	pkg, _ := icinga2Client.GetPackage(userPackage)
	if pkg != nil {
		for _, stage := range pkg.Stages {
			if stage != newStage && stage != pkg.ActiveStage {
				icinga2Client.DeleteStage(userPackage, stage)
			}
		}
	}
	return nil
}
