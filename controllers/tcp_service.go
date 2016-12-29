package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/astaxie/beego/validation"
	"github.com/jinzhu/gorm"
	"github.com/laincloud/hagrid/models"
)

type TCPServiceController struct {
	AuthController
}

func (this *TCPServiceController) NestPrepare() {
	if this.Ctx.Input.IsPost() || this.Ctx.Input.IsPut() {
		targetTCPService := &models.TCPService{}
		validator := validation.Validation{}
		if err := this.ParseForm(targetTCPService); err != nil {
			controllerLogger.Printf("Parsing TCPService form error: %s", err.Error())
			this.outputError(http.StatusInternalServerError, errorMsg500)
			this.ServeJSON()
			this.StopRun()
		} else {
			targetTCPService.AlertID, _ = strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
			targetTCPService.ID, _ = strconv.Atoi(this.Ctx.Input.Param(":tcps_id"))
			validator.Required(targetTCPService.Name, "name")
			validator.Required(targetTCPService.Host, "host")
			validator.Match(targetTCPService.Host, gsMetricReg, "host").
				Message("Should contain at most one '$'")
			validator.Required(targetTCPService.Port, "port")
			validator.Range(targetTCPService.Port, 1, 65535, "port")
			validator.Min(targetTCPService.CheckAttempts, 1, "check_attempts")
			validator.Min(targetTCPService.ResendTime, 0, "resend_time")
			if this.Ctx.Input.IsPut() {
				validator.Required(targetTCPService.ID, "id")
			}
			if validator.HasErrors() {
				for _, err := range validator.Errors {
					this.outputError(http.StatusBadRequest, fmt.Sprintf("[%s]%s", err.Key, err.Message))
					this.ServeJSON()
					this.StopRun()
				}
			}
		}
		this.Ctx.Input.SetData("targetTCPService", targetTCPService)
	}
}

func (this *TCPServiceController) Post() {
	targetTCPService := this.Ctx.Input.GetData("targetTCPService").(*models.TCPService)
	if err := models.SaveTCPService(targetTCPService); err == models.ErrorDuplicatedName {
		this.outputError(http.StatusConflict, errorMsg409)
	} else if err != nil {
		controllerLogger.Printf("PostTCPService failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusCreated, targetTCPService)
	}
	this.ServeJSON()
}

func (this *TCPServiceController) Put() {
	targetTCPService := this.Ctx.Input.GetData("targetTCPService").(*models.TCPService)
	if err := models.SaveTCPService(targetTCPService); err == models.ErrorDuplicatedName {
		this.outputError(http.StatusConflict, errorMsg409)
	} else if err == gorm.ErrRecordNotFound {
		this.outputError(http.StatusNotFound, errorMsg404)
	} else if err != nil {
		controllerLogger.Printf("PutTCPService failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusCreated, targetTCPService)
	}
	this.ServeJSON()
}

func (this *TCPServiceController) Delete() {
	tcpServiceID, _ := strconv.Atoi(this.Ctx.Input.Param(":tcps_id"))
	alertID, _ := strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
	if err := models.DeleteTCPService(tcpServiceID, alertID); err == gorm.ErrRecordNotFound {
		this.outputError(http.StatusNotFound, errorMsg404)
	} else if err != nil {
		controllerLogger.Printf("DeleteTCPService failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusNoContent, succMsg204)
	}
	this.ServeJSON()
}

func (this *TCPServiceController) Get() {
	tcpServiceIDStr := this.Ctx.Input.Param(":tcps_id")
	alertIDStr := this.Ctx.Input.Param(":alert_id")
	if tcpServiceIDStr == "all" {
		var gss []models.TCPService
		alertID, _ := strconv.Atoi(alertIDStr)
		if err := models.GetAllTCPServicesByAlertID(alertID, &gss); err == gorm.ErrRecordNotFound {
			this.outputError(http.StatusNotFound, errorMsg404)
		} else if err != nil {
			controllerLogger.Printf("GetAllTCPServices failed: %s", err.Error())
			this.outputError(http.StatusInternalServerError, errorMsg500)
		} else {
			this.outputSuccess(http.StatusOK, &gss)
		}
	} else {
		var tcps models.TCPService
		tcpServiceID, _ := strconv.Atoi(tcpServiceIDStr)
		if err := models.GetTCPService(tcpServiceID, &tcps); err == gorm.ErrRecordNotFound {
			this.outputError(http.StatusNotFound, errorMsg404)
		} else if err != nil {
			controllerLogger.Printf("GetTCPService failed: %s", err.Error())
			this.outputError(http.StatusInternalServerError, errorMsg500)
		} else {
			this.outputSuccess(http.StatusOK, &tcps)
		}
	}
	this.ServeJSON()
}
