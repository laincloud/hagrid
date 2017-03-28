package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/laincloud/hagrid/config"
	"github.com/laincloud/hagrid/models"
)

type SiteController struct {
	BaseController
}

func (this *SiteController) Home() {
	session, err := hagridSessions.Get(this.Ctx.Request, "session-name")
	if err != nil {
		session, _ = hagridSessions.New(this.Ctx.Request, "session-name")
	}
	if token, exists := session.Values["access_token"]; !exists {
		code := this.Input().Get("code")
		if code == "" {
			this.redirectToSSO()
		}
		v := url.Values{}
		v.Set("code", code)
		v.Set("client_id", strconv.Itoa(config.GetAuthClientID()))
		v.Set("client_secret", config.GetAuthSecret())
		v.Set("redirect_uri", config.GetAuthRedirectURI())
		v.Set("grant_type", "authorization_code")
		client := http.DefaultClient
		var (
			resp      *http.Response
			respBytes []byte
			userName  string
		)
		resp, err = client.Get(fmt.Sprintf("%s/oauth2/token?%s", config.GetAuthSSOURL(), v.Encode()))
		if err == nil {
			defer resp.Body.Close()
			if respBytes, err = ioutil.ReadAll(resp.Body); err == nil {
				caResp := make(map[string]interface{})
				if err = json.Unmarshal(respBytes, &caResp); err == nil {
					if token, exists = caResp["access_token"]; exists {
						session.Values["access_token"] = token
						if userName, err = this.getUserNameFromSSO(token.(string)); err == nil {
							session.Values["user_name"] = userName
							if err = models.AddUserIfNotExists(userName); err == nil {
								err = session.Save(this.Ctx.Request, this.Ctx.ResponseWriter)
							}
						}
					}
				}
			}
		}
	}
	if err != nil {
		controllerLogger.Printf("Home failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
		this.ServeJSON()
		return
	}
	this.TplName = "index.html"
}

func (this *SiteController) Logout() {
	if session, err := hagridSessions.Get(this.Ctx.Request, "session-name"); err == nil {
		delete(session.Values, "access_token")
		delete(session.Values, "user_name")
		session.Save(this.Ctx.Request, this.Ctx.ResponseWriter)
	}
	this.Redirect("/", http.StatusMovedPermanently)
}

func (this *SiteController) redirectToSSO() {
	v := url.Values{}
	v.Set("response_type", "code")
	v.Set("redirect_uri", config.GetAuthRedirectURI())
	v.Set("realm", "hagrid")
	v.Set("client_id", strconv.Itoa(config.GetAuthClientID()))
	v.Set("scope", "write:group")
	v.Set("state", fmt.Sprintf("%d", time.Now().Unix()))
	this.Redirect(fmt.Sprintf("%s/oauth2/auth?%s", config.GetAuthSSOURL(), v.Encode()), http.StatusFound)
}

func (this *SiteController) getUserNameFromSSO(token string) (string, error) {
	var (
		req       *http.Request
		resp      *http.Response
		respBytes []byte
		err       error
		userName  string
	)
	if req, err = http.NewRequest("GET", fmt.Sprintf("%s/api/me", config.GetAuthSSOURL()), nil); err == nil {
		req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", token))
		if resp, err = http.DefaultClient.Do(req); err == nil {
			defer resp.Body.Close()
			if respBytes, err = ioutil.ReadAll(resp.Body); err == nil {
				caResp := make(map[string]interface{})
				if err = json.Unmarshal(respBytes, &caResp); err == nil {
					if userNameObj, exists := caResp["name"]; exists {
						userName = userNameObj.(string)
					} else {
						err = errors.New("Username is empty")
					}
				}
			}
		}
	}
	return userName, err
}
