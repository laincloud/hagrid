package controllers

import (
	"errors"
	"net/http"

	"strconv"

	"github.com/laincloud/hagrid/config"
	"github.com/laincloud/hagrid/models"
)

var (
	ErrorUsernameEmpty = errors.New("username is empty")
	ErrorUserNull      = errors.New("username is null")
)

type AuthController struct {
	BaseController
}

func (this *AuthController) Prepare() {
	var userName string
	var err error

	if userName, err = this.getAuthUserInfo(); err != nil {
		controllerLogger.Printf("GetAuthedUserInfo failed: %s", err.Error())
		this.outputError(http.StatusUnauthorized, "Authorization failed")
		this.ServeJSON()
		this.StopRun()
	}

	user := &models.User{}
	if err = models.GetUser(userName, user); err != nil {
		controllerLogger.Printf("GetUser in prepare failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
		this.ServeJSON()
		this.StopRun()
	}

	if userName == config.GetSuperUser() {
		if err = models.GetAllAlerts(&user.AdminedAlerts); err != nil {
			this.outputError(http.StatusInternalServerError, "Authorization failed")
			this.ServeJSON()
			this.StopRun()
		}
	}
	// If user sets alert_id in the URL, then we need to check whether he/she has the privilege to write
	if alertID, err := strconv.Atoi(this.Ctx.Input.Param(":alert_id")); err == nil {
		if alertID <= 0 {
			this.outputError(http.StatusBadRequest, "You must select an alert first")
			this.ServeJSON()
			this.StopRun()
		}
		var hasAuth bool
		for _, alert := range user.AdminedAlerts {
			if alertID == alert.ID {
				hasAuth = true
				break
			}
		}
		if !hasAuth {
			this.outputError(http.StatusUnauthorized, "Authorization failed")
			this.ServeJSON()
			this.StopRun()
		}
	}

	this.Ctx.Input.SetData("auth_user", user)
	if app, ok := this.AppController.(NestPreparer); ok {
		app.NestPrepare()
	}

}

func (this *AuthController) getAuthUserInfo() (string, error) {
	session, err := hagridSessions.Get(this.Ctx.Request, "session-name")
	if err != nil {
		return "", err
	}
	var userName string
	var ok bool
	userNameObj, exists := session.Values["user_name"]
	if !exists {
		return "", ErrorUsernameEmpty
	}
	if userName, ok = userNameObj.(string); !ok {
		return "", ErrorUserNull
	}
	return userName, nil
}
