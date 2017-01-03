package controllers

import (
	"net/http"
	"strconv"

	"fmt"

	"github.com/astaxie/beego/validation"
	"github.com/jinzhu/gorm"
	"github.com/laincloud/hagrid/models"
)

type AlertController struct {
	AuthController
}

func (this *AlertController) NestPrepare() {
	if this.Ctx.Input.IsPost() || this.Ctx.Input.IsPut() {
		targetAlert := &models.Alert{
			GraphiteServices: make([]models.GraphiteService, 0),
			Admins:           make([]models.User, 0),
			Notifiers:        make([]models.User, 0),
			Templates:        make([]models.Template, 0),
			TCPServices:      make([]models.TCPService, 0),
		}
		validator := validation.Validation{}
		if err := this.ParseForm(targetAlert); err != nil {
			controllerLogger.Printf("Parsing alert form error: %s", err.Error())
			this.outputError(http.StatusInternalServerError, errorMsg500)
			this.ServeJSON()
			this.StopRun()
		} else {
			targetAlert.ID, _ = strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
			validator.Required(targetAlert.Name, "name")
			if this.Ctx.Input.IsPut() {
				validator.Required(targetAlert.ID, "id")
			}
			if validator.HasErrors() {
				for _, err := range validator.Errors {
					this.outputError(http.StatusBadRequest, fmt.Sprintf("[%s]%s", err.Key, err.Message))
					this.ServeJSON()
					this.StopRun()
				}
			}
		}
		this.Ctx.Input.SetData("targetAlert", targetAlert)
	}

}

func (this *AlertController) Post() {

	targetAlert := this.Ctx.Input.GetData("targetAlert").(*models.Alert)
	authUser := this.Ctx.Input.GetData("auth_user").(*models.User)
	targetAlert.Admins = []models.User{*authUser}

	if err := models.SaveAlert(targetAlert); err == models.ErrorDuplicatedName {
		this.outputError(http.StatusConflict, errorMsg409)
	} else if err != nil {
		controllerLogger.Printf("PostAlert failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusCreated, targetAlert)
	}
	this.ServeJSON()
}

func (this *AlertController) Put() {
	targetAlert := this.Ctx.Input.GetData("targetAlert").(*models.Alert)
	if err := models.SaveAlert(targetAlert); err == models.ErrorDuplicatedName {
		this.outputError(http.StatusConflict, errorMsg409)
	} else if err == gorm.ErrRecordNotFound {
		this.outputError(http.StatusNotFound, errorMsg404)
	} else if err != nil {
		controllerLogger.Printf("PutAlert failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		if err := models.SynchronizeAlert(targetAlert.ID); err != nil {
			controllerLogger.Printf("SyncAlert failed: %s", err.Error())
			this.outputError(http.StatusInternalServerError, errorMsg500)
		} else {
			this.outputSuccess(http.StatusCreated, targetAlert)
		}
		this.outputSuccess(http.StatusCreated, targetAlert)
	}
	this.ServeJSON()
}

func (this *AlertController) Delete() {
	targetAlertID, _ := strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
	if err := models.DeleteAlert(targetAlertID); err == gorm.ErrRecordNotFound {
		this.outputError(http.StatusNotFound, errorMsg404)
	} else if err != nil {
		controllerLogger.Printf("DeleteAlert failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, err.Error())
	} else {
		this.outputSuccess(http.StatusNoContent, succMsg204)
	}
	this.ServeJSON()
}

func (this *AlertController) Get() {
	idStr := this.Ctx.Input.Param(":alert_id")
	if idStr == "all" {
		authUser := this.Ctx.Input.GetData("auth_user").(*models.User)
		this.outputSuccess(http.StatusOK, &authUser.AdminedAlerts)
	} else {
		id, _ := strconv.Atoi(idStr)
		alert := &models.Alert{
			GraphiteServices: make([]models.GraphiteService, 0),
			Admins:           make([]models.User, 0),
			Notifiers:        make([]models.User, 0),
			Templates:        make([]models.Template, 0),
			TCPServices:      make([]models.TCPService, 0),
		}
		if err := models.GetDetailedAlert(alert, id); err == gorm.ErrRecordNotFound {
			this.outputError(http.StatusNotFound, errorMsg404)
		} else if err != nil {
			controllerLogger.Printf("GetAlert failed: %s", err.Error())
			this.outputError(http.StatusInternalServerError, errorMsg500)
		} else {
			this.outputSuccess(http.StatusOK, alert)
		}
	}
	this.ServeJSON()
}
