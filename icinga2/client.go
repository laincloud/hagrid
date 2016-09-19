package icinga2

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

type Icinga2Client struct {
	Address  string
	Client   *http.Client
	User     string
	Password string
}

type Icinga2Package struct {
	Name        string   `json:"name"`
	ActiveStage string   `json:"active-stage"`
	Stages      []string `json:"stages"`
}

type Icinga2StageResponse struct {
	Code    float32 `json:"code"`
	Package string  `json:"package"`
	Status  string  `json:"status"`
	Stage   string  `json:"stage"`
}

func (ic *Icinga2Client) GetAllPackages() ([]Icinga2Package, error) {
	pkgsMap := make(map[string][]Icinga2Package)
	var pkgs []Icinga2Package
	data, _, err := ic.requestWithBasicAuth("GET", "/v1/config/packages", "")
	if err != nil {
		return pkgs, err
	}
	if err = json.Unmarshal(data, &pkgsMap); err != nil {
		return pkgs, err
	}
	return pkgsMap["results"], nil
}

func (ic *Icinga2Client) GetPackage(pkgName string) (*Icinga2Package, error) {
	pkgs, err := ic.GetAllPackages()
	if err != nil {
		return nil, err
	}
	var curPkg *Icinga2Package
	for _, pkg := range pkgs {
		if pkg.Name == pkgName {
			curPkg = &pkg
			break
		}
	}
	if curPkg == nil {
		return nil, fmt.Errorf("package %s is not found", curPkg)
	}
	return curPkg, nil
}

func (ic *Icinga2Client) CreatePackage(pkgName string) {
	ic.requestWithBasicAuth("POST", "/v1/config/packages/"+pkgName, "")
}

func (ic *Icinga2Client) DeletePackage(pkgName string) {
	ic.requestWithBasicAuth("DELETE", "/v1/config/packages/"+pkgName, "")
}

func (ic *Icinga2Client) DeleteStage(pkgName, stage string) {
	ic.requestWithBasicAuth("DELETE", "/v1/config/stages/"+pkgName+"/"+stage, "")
}

// UploadFiles returns the new stage name after uploading files to the package
func (ic *Icinga2Client) UploadFiles(pkgName string, files map[string]string) (string, error) {
	_, err := ic.GetPackage(pkgName)
	if err != nil {
		return "", err
	}

	formDataMap := make(map[string]map[string]string)
	formDataMap["files"] = files
	var respData []byte
	var retCode int
	formData, _ := json.Marshal(formDataMap)
	if respData, retCode, err = ic.requestWithBasicAuth("POST", "/v1/config/stages/"+pkgName, string(formData)); err != nil {
		return "", err
	}
	if retCode != http.StatusOK {
		return "", fmt.Errorf("package %s uploads files failed", pkgName)
	}
	respMap := make(map[string][]Icinga2StageResponse)
	if err = json.Unmarshal(respData, &respMap); err != nil {
		return "", err
	}
	stage, exists := respMap["results"]
	if !exists || len(stage) == 0 {
		return "", fmt.Errorf("response of packge %s uploaded file is wrong", pkgName)
	}
	return stage[0].Stage, nil
}

func (ic *Icinga2Client) CheckPackageStatus(pkgName, curStage string) error {
	curPkg, err := ic.GetPackage(pkgName)
	if err != nil {
		return err
	}
	if curPkg.ActiveStage != curStage {
		return fmt.Errorf("the expected stage %s is not matched the actual %s", curStage, curPkg.ActiveStage)
	}
	return nil
}

func (ic *Icinga2Client) requestWithBasicAuth(method, reqUrl string, form string) ([]byte, int, error) {
	req, _ := http.NewRequest(method, ic.Address+reqUrl, strings.NewReader(form))
	req.SetBasicAuth(ic.User, ic.Password)
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	var data []byte
	resp, err := ic.Client.Do(req)
	if err != nil {
		return data, http.StatusInternalServerError, err
	}
	data, err = ioutil.ReadAll(resp.Body)
	resp.Body.Close()
	return data, resp.StatusCode, err
}
