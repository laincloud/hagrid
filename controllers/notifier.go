package controllers

import (
	"fmt"
	"net/http"

	"strconv"

	"github.com/astaxie/beego/validation"
	"github.com/jinzhu/gorm"
	"github.com/laincloud/hagrid/models"
)

type NotifierController struct {
	AuthController
}

func (this *NotifierController) NestPrepare() {
	var notifierID int
	if this.Ctx.Input.IsPost() {
		validator := validation.Validation{}
		notifierIDStr := this.GetString("notifier_id")
		validator.Required(notifierIDStr, "notifier_id")
		validator.Numeric(notifierIDStr, "notifier_id")
		if validator.HasErrors() {
			for _, err := range validator.Errors {
				this.outputError(http.StatusBadRequest, fmt.Sprintf("[%s]%s", err.Key, err.Message))
				this.ServeJSON()
				this.StopRun()
			}
		}
		notifierID, _ = strconv.Atoi(notifierIDStr)
	} else {
		notifierID, _ = strconv.Atoi(this.Ctx.Input.Param(":notifier_id"))
	}
	if isSuper, err := models.IsSuperUser(notifierID); isSuper {
		this.outputError(http.StatusForbidden, errorMsg403)
		this.ServeJSON()
		this.StopRun()
	} else if err != nil {
		this.outputError(http.StatusInternalServerError, errorMsg500)
		this.ServeJSON()
		this.StopRun()
	} else {
		controllerLogger.Println("%s", notifierID)
		this.Ctx.Input.SetData("notifierID", notifierID)
	}
}

func (this *NotifierController) Post() {
	notifierID, _ := this.Ctx.Input.GetData("notifierID").(int)
	alertID, _ := strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
	if err := models.AddNotifier(alertID, notifierID); err == models.ErrorDuplicatedName {
		this.outputError(http.StatusConflict, errorMsg409)
	} else if err == gorm.ErrRecordNotFound {
		this.outputError(http.StatusNotFound, errorMsg404)
	} else if err != nil {
		controllerLogger.Printf("PostNotifier failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusCreated, map[string]string{
			"message": "Add notifier successfully",
		})
	}
	this.ServeJSON()
}

func (this *NotifierController) Delete() {
	notifierID, _ := this.Ctx.Input.GetData("notifierID").(int)
	alertID, _ := strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
	if err := models.DeleteNotifier(alertID, notifierID); err == gorm.ErrRecordNotFound {
		this.outputError(http.StatusNotFound, errorMsg404)
	} else if err != nil {
		controllerLogger.Printf("DeleteNotifier failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusNoContent, succMsg204)
	}
	this.ServeJSON()
}

func (this *NotifierController) Get() {
	alertID, _ := strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
	var notifiers []models.User
	if err := models.GetNotifiersByAlertID(alertID, &notifiers); err == gorm.ErrRecordNotFound {
		this.outputError(http.StatusNotFound, errorMsg404)
	} else if err != nil {
		controllerLogger.Printf("GetNotifiers failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusOK, &notifiers)
	}
	this.ServeJSON()
}
