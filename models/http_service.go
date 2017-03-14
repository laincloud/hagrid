package models

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
	"unicode"

	"github.com/jessevdk/go-flags"
)

const (
	HTTPServiceCheckCommand = "check_http"
	HTTPServiceTypeSimple   = 0
	HTTPServiceTypeAdvanced = 1
)

var httpCheckCmdPath = filepath.Join(os.Getenv("PLUGIN_DIR"), HTTPServiceCheckCommand)

type HTTPService struct {
	ID            int    `gorm:"primary_key" form:"-"`
	AlertID       int    `gorm:"not null" form:"-"`
	Name          string `gorm:"type:varchar(64);not null" form:"name"`
	Type          int    `gorm:"not null;" form:"type"`
	Parameters    string `gorm:"type:longtext;not null" form:"parameters"`
	CheckAttempts int    `gorm:"not null; default 3" form:"check_attempts"`
	Enabled       bool   `gorm:"not null" form:"enabled"`
	ResendTime    int    `gorm:"not null" form:"resend_time"`
	CreatedAt     time.Time

	Alert Alert `gorm:"ForeignKey:AlertID"`
}

func GetAllHTTPServicesByAlertID(alertID int, services *[]HTTPService) error {
	return db.Find(services, "alert_id = ?", alertID).Error
}

func GetHTTPService(serviceID int, service *HTTPService) error {
	return db.First(service, serviceID).Error
}

func SaveHTTPService(service *HTTPService) error {
	if isHTTPServiceDuplicated(service) {
		return ErrorDuplicatedName
	}
	return db.Save(service).Error
}

func DeleteHTTPService(serviceID, alertID int) error {
	return db.Delete(HTTPService{}, "id = ? AND alert_id = ?", serviceID, alertID).Error
}

func isHTTPServiceDuplicated(service *HTTPService) bool {
	var count int
	err := db.Model(&HTTPService{}).Where("name = ? AND alert_id = ? AND id <> ?",
		service.Name, service.AlertID, service.ID).Count(&count).Error
	return count != 0 || err != nil
}

func TestHTTPService(service *HTTPService) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()
	cmdParams := parseCmdParamList(service.Parameters)
	cmd := exec.CommandContext(ctx, httpCheckCmdPath, append(cmdParams, "-v")...)
	res, err := cmd.CombinedOutput()

	return string(res), err
}

func (httpS *HTTPService) GenerateServices(templates []Template) []Icinga2Service {
	services := make([]Icinga2Service, 0, 1)
	if httpS.Enabled {
		service := Icinga2HTTPService{
			ID:            fmt.Sprintf("[HTTPService]%d", httpS.ID),
			Name:          fmt.Sprintf("[HTTPService]%s-%s", httpS.Alert.Name, httpS.Name),
			CheckAttempts: httpS.CheckAttempts,
			ResendTime:    httpS.ResendTime,
		}
		flags.ParseArgs(&(service.Params), parseCmdParamList(httpS.Parameters))
		services = append(services, service)
	}
	return services
}

func parseCmdParamList(cmdStr string) []string {
	lastQuote := rune(0)
	f := func(c rune) bool {
		switch {
		case c == lastQuote:
			lastQuote = rune(0)
			return false
		case lastQuote != rune(0):
			return false
		case unicode.In(c, unicode.Quotation_Mark):
			lastQuote = c
			return false
		default:
			return unicode.IsSpace(c)
		}
	}
	parts := strings.FieldsFunc(cmdStr, f)

	for i, param := range parts {
		parts[i] = strings.Replace(param, "'", "", -1)
	}
	return parts
}

// Implements Icinga2Service
type Icinga2HTTPService struct {
	ID            string
	Name          string
	Params        CheckHTTPCmdParams
	CheckAttempts int
	ResendTime    int
}

type CheckHTTPCmdParams struct {
	HostName      string   `short:"H" long:"hostname"`
	IPAddress     string   `short:"I" long:"IP-Address"`
	Port          string   `short:"p" long:"port"`
	UseIPv4       bool     `short:"4"`
	UseIPv6       bool     `short:"6"`
	SSlVersion    string   `short:"S" long:"ssl"`
	SSlEnable     bool     `long:"sni"`
	Certificate   string   `short:"C" long:"certificate"`
	Expect        string   `short:"e" long:"expect"`
	HeaderExpect  string   `short:"d" long:"header-string"`
	ContentExpect string   `short:"s" long:"string"`
	URI           string   `short:"u" long:"uri"`
	PostData      string   `short:"P" long:"post"`
	Method        string   `short:"j" long:"method"`
	IgnoreBody    bool     `short:"N" long:"no-body"`
	MaxAge        string   `short:"M" long:"max-age"`
	ContentType   string   `short:"T" long:"content-type"`
	LineSpan      bool     `short:"l" long:"linespan"`
	Regex         string   `short:"r" long:"regex" long:"ereg"`
	RegexCaseIns  string   `short:"R" long:"eregi"`
	InvertRegex   bool     `long:"invert-regex"`
	BasicAuth     string   `short:"a" long:"authorization"`
	ProxyAuth     string   `short:"b" long:"proxy-authorization"`
	UserAgent     string   `short:"A" long:"useragent"`
	Header        []string `short:"k" long:"header"`
	WrapLink      bool     `short:"L" long:"link"`
	OnRedirect    string   `short:"f" long:"onredirect"`
	MinPageSize   string   `short:"m" long:"pagesize"`
}

func (httpS Icinga2HTTPService) GetServiceID() string {
	return httpS.ID
}

func (httpS Icinga2HTTPService) GetServiceName() string {
	return httpS.Name
}

func (httpS Icinga2HTTPService) GetServiceCheckCommand() string {
	return HTTPServiceCheckCommand
}

func (httpS Icinga2HTTPService) GetServiceCheckAttempts() int {
	return httpS.CheckAttempts
}

func (httpS Icinga2HTTPService) GetServiceResendTime() int {
	return httpS.ResendTime
}

func (httpS Icinga2HTTPService) GetServiceVars() map[string]interface{} {
	return map[string]interface{}{
		"hostname":       httpS.Params.HostName,
		"ip_address":     httpS.Params.IPAddress,
		"ssl_version":    httpS.Params.SSlVersion,
		"certificate":    httpS.Params.Certificate,
		"expect":         httpS.Params.Expect,
		"header_expect":  httpS.Params.HeaderExpect,
		"content_expect": httpS.Params.ContentExpect,
		"uri":            httpS.Params.URI,
		"post":           httpS.Params.PostData,
		"method":         httpS.Params.Method,
		"max_age":        httpS.Params.MaxAge,
		"content_type":   httpS.Params.ContentType,
		"regex":          httpS.Params.Regex,
		"regex_caseins":  httpS.Params.RegexCaseIns,
		"basic_auth":     httpS.Params.BasicAuth,
		"proxy_auth":     httpS.Params.ProxyAuth,
		"user_agent":     httpS.Params.UserAgent,
		"on_redirect":    httpS.Params.OnRedirect,
		"min_pagesize":   httpS.Params.MinPageSize,
	}
}

func (httpS Icinga2HTTPService) GetServiceNonStrVars() map[string]interface{} {
	var headerStr string
	if len(httpS.Params.Header) > 0 {
		headerStr = fmt.Sprintf("[\"%s\"]", strings.Join(httpS.Params.Header, "\",\""))
	}
	return map[string]interface{}{
		"port":         httpS.Params.Port,
		"use_ipv4":     httpS.Params.UseIPv4,
		"use_ipv6":     httpS.Params.UseIPv6,
		"ssl_enable":   httpS.Params.SSlEnable,
		"ignore_body":  httpS.Params.IgnoreBody,
		"linespan":     httpS.Params.LineSpan,
		"invert_regex": httpS.Params.InvertRegex,
		"headers":      headerStr,
		"wrap_link":    httpS.Params.WrapLink,
	}
}
