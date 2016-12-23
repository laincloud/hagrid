package controllers

import (
	"fmt"
	"net/http"
	"regexp"
	"strconv"

	"github.com/astaxie/beego/validation"
	"github.com/jinzhu/gorm"
	"github.com/laincloud/hagrid/models"
)

type GraphiteServiceController struct {
	AuthController
}

var (
	gsMetricReg     = regexp.MustCompile("^[^$]*\\$?[^$]*$")
	gsFloatValueReg = regexp.MustCompile("^[-+]?([0-9]+(\\.[0-9]+)?|\\.[0-9]+)$")
	gsCheckTypeReg  = regexp.MustCompile(fmt.Sprintf("^(%s|%s|%s|%s)$",
		models.Equal, models.Greater, models.Less, models.NotEqual))
)

func (this *GraphiteServiceController) NestPrepare() {
	if this.Ctx.Input.IsPost() || this.Ctx.Input.IsPut() {
		targetGraphiteService := &models.GraphiteService{}
		validator := validation.Validation{}
		if err := this.ParseForm(targetGraphiteService); err != nil {
			controllerLogger.Printf("Parsing GraphiteService form error: %s", err.Error())
			this.outputError(http.StatusInternalServerError, errorMsg500)
			this.ServeJSON()
			this.StopRun()
		} else {
			targetGraphiteService.AlertID, _ = strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
			targetGraphiteService.ID, _ = strconv.Atoi(this.Ctx.Input.Param(":gs_id"))
			validator.Required(targetGraphiteService.Name, "name")
			validator.Required(targetGraphiteService.Warning, "warning")
			validator.Match(targetGraphiteService.Warning, gsFloatValueReg, "warning").
				Message("Should be float")
			validator.Required(targetGraphiteService.Critical, "critical")
			validator.Match(targetGraphiteService.Critical, gsFloatValueReg, "critical").
				Message("Should be float")
			validator.Required(targetGraphiteService.CheckType, "check_type")
			validator.Match(targetGraphiteService.CheckType, gsCheckTypeReg, "check_type").
				Message("Should be one of '%s', '%s', '%s', '%s'",
					models.Equal, models.Greater, models.Less, models.NotEqual)
			validator.Required(targetGraphiteService.Metric, "metric")
			validator.Match(targetGraphiteService.Metric, gsMetricReg, "metric").
				Message("Should contain at most one '$'")
			validator.Min(targetGraphiteService.CheckAttempts, 1, "check_attempts")
			validator.Min(targetGraphiteService.ResendTime, 0, "resend_time")
			if this.Ctx.Input.IsPut() {
				validator.Required(targetGraphiteService.ID, "id")
			}
			if validator.HasErrors() {
				for _, err := range validator.Errors {
					this.outputError(http.StatusBadRequest, fmt.Sprintf("[%s]%s", err.Key, err.Message))
					this.ServeJSON()
					this.StopRun()
				}
			}
		}
		this.Ctx.Input.SetData("targetGraphiteService", targetGraphiteService)
	}
}

func (this *GraphiteServiceController) Post() {
	targetGraphiteService := this.Ctx.Input.GetData("targetGraphiteService").(*models.GraphiteService)
	if err := models.SaveGraphiteService(targetGraphiteService); err == models.ErrorDuplicatedName {
		this.outputError(http.StatusConflict, errorMsg409)
	} else if err != nil {
		controllerLogger.Printf("PostGraphiteService failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusCreated, targetGraphiteService)
	}
	this.ServeJSON()
}

func (this *GraphiteServiceController) Put() {
	targetGraphiteService := this.Ctx.Input.GetData("targetGraphiteService").(*models.GraphiteService)
	if err := models.SaveGraphiteService(targetGraphiteService); err == models.ErrorDuplicatedName {
		this.outputError(http.StatusConflict, errorMsg409)
	} else if err == gorm.ErrRecordNotFound {
		this.outputError(http.StatusNotFound, errorMsg404)
	} else if err != nil {
		controllerLogger.Printf("PutGraphiteService failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusCreated, targetGraphiteService)
	}
	this.ServeJSON()
}

func (this *GraphiteServiceController) Get() {
	gsIDStr := this.Ctx.Input.Param(":gs_id")
	alertIDStr := this.Ctx.Input.Param(":alert_id")
	if gsIDStr == "all" {
		var gss []models.GraphiteService
		alertID, _ := strconv.Atoi(alertIDStr)
		if err := models.GetAllGraphiteServicesByAlertID(alertID, &gss); err == gorm.ErrRecordNotFound {
			this.outputError(http.StatusNotFound, errorMsg404)
		} else if err != nil {
			controllerLogger.Printf("GetAllGraphiteServices failed: %s", err.Error())
			this.outputError(http.StatusInternalServerError, errorMsg500)
		} else {
			this.outputSuccess(http.StatusOK, &gss)
		}
	} else {
		var gs models.GraphiteService
		gsID, _ := strconv.Atoi(gsIDStr)
		if err := models.GetGraphiteService(gsID, &gs); err == gorm.ErrRecordNotFound {
			this.outputError(http.StatusNotFound, errorMsg404)
		} else if err != nil {
			controllerLogger.Printf("GetGraphiteService failed: %s", err.Error())
			this.outputError(http.StatusInternalServerError, errorMsg500)
		} else {
			this.outputSuccess(http.StatusOK, &gs)
		}
	}
	this.ServeJSON()
}

func (this *GraphiteServiceController) Delete() {
	gsID, _ := strconv.Atoi(this.Ctx.Input.Param(":gs_id"))
	alertID, _ := strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
	if err := models.DeleteGraphiteService(gsID, alertID); err == gorm.ErrRecordNotFound {
		this.outputError(http.StatusNotFound, errorMsg404)
	} else if err != nil {
		controllerLogger.Printf("DeleteGraphiteService failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusNoContent, succMsg204)
	}
	this.ServeJSON()
}
