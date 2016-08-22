package config

import (
	"bufio"
	"encoding/json"
	"io/ioutil"
	"os"
)

type HagridConfig struct {
	DBHost     string `json:"db_host"`
	DBName     string `json:"db_name"`
	DBPort     int    `json:"db_port"`
	DBUser     string `json:"db_user"`
	DBPassword string `json:"db_password"`
	DBDebug    bool   `json:"db_debug"`
	DBMigrate  bool   `json:"db_migrate"`

	AuthSSOURL      string `json:"auth_sso_url"`
	AuthClientID    int    `json:"auth_client_id"`
	AuthSecret      string `json:"auth_secret"`
	AuthRedirectURI string `json:"auth_redirect_uri"`

	Icinga2APIAddress        string   `json:"icinga2_api_address"`
	Icinga2APIUser           string   `json:"icinga2_api_user"`
	Icinga2APIPassword       string   `json:"icinga2_api_password"`
	Icinga2NotificationTypes []string `json:"icinga2_notification_types"`

	SuperUser string `json:"superuser"`

	Source string `json:"source"`
}

var hagridConfig HagridConfig

func init() {
	var err error
	var file *os.File
	if file, err = os.Open("hagrid.conf.json"); err != nil {
		panic(err)
	}

	defer file.Close()
	bfRd := bufio.NewReader(file)
	var data []byte
	if data, err = ioutil.ReadAll(bfRd); err != nil {
		panic(err)
	}
	if err = json.Unmarshal(data, &hagridConfig); err != nil {
		panic(err)
	}
}

func GetDatabaseHost() string {
	return hagridConfig.DBHost
}

func GetDatabaseName() string {
	return hagridConfig.DBName
}

func GetDatabasePort() int {
	return hagridConfig.DBPort
}

func GetDatabaseUser() string {
	return hagridConfig.DBUser
}

func GetDatabaseDebug() bool {
	return hagridConfig.DBDebug
}

func GetDatabaseMigrate() bool {
	return hagridConfig.DBMigrate
}

func GetDatabasePassword() string {
	return hagridConfig.DBPassword
}

func GetAuthSSOURL() string {
	return hagridConfig.AuthSSOURL
}

func GetSuperUser() string {
	return hagridConfig.SuperUser
}

func GetAuthClientID() int {
	return hagridConfig.AuthClientID
}

func GetAuthSecret() string {
	return hagridConfig.AuthSecret
}

func GetAuthRedirectURI() string {
	return hagridConfig.AuthRedirectURI
}

func GetIcinga2APIAddress() string {
	return hagridConfig.Icinga2APIAddress
}

func GetIcinga2APIUser() string {
	return hagridConfig.Icinga2APIUser
}

func GetIcinga2APIPassword() string {
	return hagridConfig.Icinga2APIPassword
}

func GetIcinga2NotificationTypes() []string {
	return hagridConfig.Icinga2NotificationTypes
}

func GetSource() string {
	return hagridConfig.Source
}
