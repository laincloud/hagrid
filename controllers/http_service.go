package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/astaxie/beego/validation"
	"github.com/jinzhu/gorm"
	"github.com/laincloud/hagrid/models"
)

type HTTPServiceController struct {
	AuthController
}

func (this *HTTPServiceController) NestPrepare() {
	if this.Ctx.Input.IsPost() || this.Ctx.Input.IsPut() {
		targetHTTPService := &models.HTTPService{}
		validator := validation.Validation{}
		if err := this.ParseForm(targetHTTPService); err != nil {
			controllerLogger.Printf("Parsing HTTPService form error: %s", err.Error())
			this.outputError(http.StatusInternalServerError, errorMsg500)
			this.ServeJSON()
			this.StopRun()
		} else {
			targetHTTPService.AlertID, _ = strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
			targetHTTPService.ID, _ = strconv.Atoi(this.Ctx.Input.Param(":https_id"))
			validator.Required(targetHTTPService.Name, "name")
			validator.Range(targetHTTPService.Type, 0, 1, "type")
			validator.Required(targetHTTPService.Parameters, "parameters")
			validator.Min(targetHTTPService.CheckAttempts, 1, "check_attempts")
			validator.Min(targetHTTPService.ResendTime, 0, "resend_time")
			if this.Ctx.Input.IsPut() {
				validator.Required(targetHTTPService.ID, "id")
			}
			if validator.HasErrors() {
				for _, err := range validator.Errors {
					this.outputError(http.StatusBadRequest, fmt.Sprintf("[%s]%s", err.Key, err.Message))
					this.ServeJSON()
					this.StopRun()
				}
			}
		}
		this.Ctx.Input.SetData("targetHTTPService", targetHTTPService)
	}
}

func (this *HTTPServiceController) Post() {
	targetHTTPService := this.Ctx.Input.GetData("targetHTTPService").(*models.HTTPService)
	if err := models.SaveHTTPService(targetHTTPService); err == models.ErrorDuplicatedName {
		this.outputError(http.StatusConflict, errorMsg409)
	} else if err != nil {
		controllerLogger.Printf("PostHTTPService failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusCreated, targetHTTPService)
	}
	this.ServeJSON()
}

func (this *HTTPServiceController) Put() {
	targetHTTPService := this.Ctx.Input.GetData("targetHTTPService").(*models.HTTPService)
	if err := models.SaveHTTPService(targetHTTPService); err == models.ErrorDuplicatedName {
		this.outputError(http.StatusConflict, errorMsg409)
	} else if err == gorm.ErrRecordNotFound {
		this.outputError(http.StatusNotFound, errorMsg404)
	} else if err != nil {
		controllerLogger.Printf("PutHTTPService failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusCreated, targetHTTPService)
	}
	this.ServeJSON()
}

func (this *HTTPServiceController) Delete() {
	httpServiceID, _ := strconv.Atoi(this.Ctx.Input.Param(":https_id"))
	alertID, _ := strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
	if err := models.DeleteHTTPService(httpServiceID, alertID); err == gorm.ErrRecordNotFound {
		this.outputError(http.StatusNotFound, errorMsg404)
	} else if err != nil {
		controllerLogger.Printf("DeleteTCPService failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusNoContent, succMsg204)
	}
	this.ServeJSON()
}

func (this *HTTPServiceController) Get() {
	httpServiceIDStr := this.Ctx.Input.Param(":https_id")
	alertIDStr := this.Ctx.Input.Param(":alert_id")
	if httpServiceIDStr == "all" {
		var hss []models.HTTPService
		alertID, _ := strconv.Atoi(alertIDStr)
		if err := models.GetAllHTTPServicesByAlertID(alertID, &hss); err == gorm.ErrRecordNotFound {
			this.outputError(http.StatusNotFound, errorMsg404)
		} else if err != nil {
			controllerLogger.Printf("GetAllHTTPServices failed: %s", err.Error())
			this.outputError(http.StatusInternalServerError, errorMsg500)
		} else {
			this.outputSuccess(http.StatusOK, &hss)
		}
	} else {
		var https models.HTTPService
		httpServiceID, _ := strconv.Atoi(httpServiceIDStr)
		if err := models.GetHTTPService(httpServiceID, &https); err == gorm.ErrRecordNotFound {
			this.outputError(http.StatusNotFound, errorMsg404)
		} else if err != nil {
			controllerLogger.Printf("GetAllHTTPServices failed: %s", err.Error())
			this.outputError(http.StatusInternalServerError, errorMsg500)
		} else {
			this.outputSuccess(http.StatusOK, &https)
		}
	}
	this.ServeJSON()
}

func (this *HTTPServiceController) Test() {
	targetHTTPService := this.Ctx.Input.GetData("targetHTTPService").(*models.HTTPService)
	output, err := models.TestHTTPService(targetHTTPService)
	if err != nil {
		controllerLogger.Printf("TestHTTPService failed: %s", err.Error())
		this.outputError(http.StatusBadRequest, output)
	} else {
		this.outputSuccess(http.StatusCreated, &output)
	}
	this.ServeJSON()
}
