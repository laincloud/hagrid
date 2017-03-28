package models

import (
	"time"

	"github.com/jinzhu/gorm"
	"github.com/laincloud/hagrid/config"
)

type User struct {
	ID               int    `gorm:"primary_key:true" form:"-"`
	Name             string `gorm:"type:varchar(64);not null;unique" form:"-"`
	EmailAddress     string `gorm:"type:varchar(64);not null" form:"email_address"`
	PhoneNumber      string `gorm:"type:varchar(64);not null" form:"phone_number"`
	BearychatTeam    string `gorm:"type:varchar(64);not null" form:"bearychat_team"`
	BearychatToken   string `gorm:"type:varchar(64);not null" form:"bearychat_token"`
	BearychatChannel string `gorm:"type:varchar(64);not null" form:"bearychat_channel"`
	PushbulletToken  string `gorm:"type:varchar(64);not null" form:"pushbullet_token"`
	SlackTeam        string `gorm:"type:varchar(64);not null" form:"slack_team"`
	SlackToken       string `gorm:"type:varchar(64);not null" form:"slack_token"`
	SlackChannel     string `gorm:"type:varchar(64);not null" form:"slack_channel"`
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
	return db.FirstOrCreate(maybeNewUser, maybeNewUser).Error
}

func UpdateUser(user *User) error {
	syncLock.Lock()
	defer syncLock.Unlock()
	if err := db.Save(user).Error; err != nil {
		return err
	}
	return renderUsers()
}

func GetUser(userName string, user *User) error {
	if err := db.First(user, "name = ?", userName).Error; err != nil {
		return err
	}
	return db.Model(&user).Association("AdminedAlerts").Find(&(user.AdminedAlerts)).Error
}

func GetAllUsers(users *[]User, namePattern string) error {
	return db.Select("id, name").Where("name LIKE ? AND name <> ?", namePattern, config.GetSuperUser()).Find(users).Error
}

func GetAllUsersDetails(users *[]User, namePattern string) error {
	return db.Where("name LIKE ? AND name <> ?", namePattern, config.GetSuperUser()).Find(users).Error
}

func GetNotifiersByAlertID(id int, notifiers *[]User) error {
	return db.Model(&Alert{ID: id}).Association("Notifiers").Find(notifiers).Error
}

func DeleteNotifier(alertID, notifierID int) error {
	return db.Exec("DELETE FROM `alert_to_user_notify` where alert_id = ? and user_id = ?", alertID, notifierID).Error
}

func AddNotifier(alertID, notifierID int) error {
	if isNotifierDuplicated(alertID, notifierID) {
		return ErrorDuplicatedName
	}
	if err := db.First(&User{}, notifierID).Error; err != nil {
		return err
	}
	return db.Exec("INSERT INTO `alert_to_user_notify`(alert_id, user_id) values(?, ?)", alertID, notifierID).Error
}

func isNotifierDuplicated(alertID, notifierID int) bool {
	var count int
	err := db.Table("alert_to_user_notify").Where("alert_id = ? and user_id = ?", alertID, notifierID).Count(&count).Error
	return count != 0 || err != nil
}

func GetAdminsByAlertID(id int, admins *[]User) error {
	return db.Model(&Alert{ID: id}).Association("Admins").Find(admins).Error
}

func DeleteAdmin(alertID, adminID int) error {
	return db.Exec("DELETE FROM `alert_to_user_admin` where alert_id = ? and user_id = ?", alertID, adminID).Error
}

func AddAdmin(alertID, adminID int) error {
	if isAdminDuplicated(alertID, adminID) {
		return ErrorDuplicatedName
	}
	if err := db.First(&User{}, adminID).Error; err != nil {
		return err
	}
	return db.Exec("INSERT INTO `alert_to_user_admin`(alert_id, user_id) values(?, ?)", alertID, adminID).Error
}

func isAdminDuplicated(alertID, adminID int) bool {
	var count int
	err := db.Table("alert_to_user_admin").Where("alert_id = ? and user_id = ?", alertID, adminID).Count(&count).Error
	return count != 0 || err != nil
}

func IsSuperUser(userID int) (bool, error) {
	var err error
	if err = db.First(&User{}, "id = ? AND name = ?", userID, config.GetSuperUser()).Error; err == nil {
		return true, nil
	}
	if err == gorm.ErrRecordNotFound {
		return false, nil
	}
	return false, err
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
	icinga2Client.CreatePackage(userPackage)
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
