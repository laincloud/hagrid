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

type TemplateController struct {
	AuthController
}

var templateNameReg = regexp.MustCompile(`^[^$]+$`)

func (this *TemplateController) NestPrepare() {
	if this.Ctx.Input.IsPost() || this.Ctx.Input.IsPut() {
		targetTemplate := &models.Template{}
		validator := validation.Validation{}
		if err := this.ParseForm(targetTemplate); err != nil {
			controllerLogger.Printf("Parsing template form error: %s", err.Error())
			this.outputError(http.StatusInternalServerError, errorMsg500)
			this.ServeJSON()
			this.StopRun()
		} else {
			targetTemplate.AlertID, _ = strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
			targetTemplate.ID, _ = strconv.Atoi(this.Ctx.Input.Param(":template_id"))
			validator.Required(targetTemplate.Name, "name")
			validator.Match(targetTemplate.Values, templateNameReg, "values").Message("Shouldn't contain any '$'")
			if this.Ctx.Input.IsPut() {
				validator.Required(targetTemplate.ID, "id")
			}
			if validator.HasErrors() {
				for _, err := range validator.Errors {
					this.outputError(http.StatusBadRequest, fmt.Sprintf("[%s]%s", err.Key, err.Message))
					this.ServeJSON()
					this.StopRun()
				}
			}
		}
		this.Ctx.Input.SetData("targetTemplate", targetTemplate)
	}
}

func (this *TemplateController) Post() {
	targetTemplate := this.Ctx.Input.GetData("targetTemplate").(*models.Template)
	if err := models.SaveTemplate(targetTemplate); err == models.ErrorDuplicatedName {
		this.outputError(http.StatusConflict, errorMsg409)
	} else if err != nil {
		controllerLogger.Printf("PostTemplate failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusCreated, targetTemplate)
	}
	this.ServeJSON()
}

func (this *TemplateController) Put() {
	targetTemplate := this.Ctx.Input.GetData("targetTemplate").(*models.Template)
	if err := models.SaveTemplate(targetTemplate); err == models.ErrorDuplicatedName {
		this.outputError(http.StatusConflict, errorMsg409)
	} else if err == gorm.ErrRecordNotFound {
		this.outputError(http.StatusNotFound, errorMsg404)
	} else if err != nil {
		controllerLogger.Printf("PutTemplate failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusCreated, targetTemplate)
	}
	this.ServeJSON()
}

func (this *TemplateController) Delete() {
	targetTemplateID, _ := strconv.Atoi(this.Ctx.Input.Param(":template_id"))
	alertID, _ := strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
	if err := models.DeleteTemplate(targetTemplateID, alertID); err == gorm.ErrRecordNotFound {
		this.outputError(http.StatusNotFound, errorMsg404)
	} else if err != nil {
		controllerLogger.Printf("DeleteTemplate failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusNoContent, succMsg204)
	}
	this.ServeJSON()
}

func (this *TemplateController) Get() {
	templateIDStr := this.Ctx.Input.Param(":template_id")
	alertID, _ := strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
	if templateIDStr == "all" {
		var templates []models.Template
		if err := models.GetAllTemplatesByAlertID(alertID, &templates); err == gorm.ErrRecordNotFound {
			this.outputError(http.StatusNotFound, errorMsg404)
		} else if err != nil {
			controllerLogger.Printf("GetAllTemplates failed: %s", err.Error())
			this.outputError(http.StatusInternalServerError, errorMsg500)
		} else {
			this.outputSuccess(http.StatusOK, &templates)
		}
	} else {
		var template models.Template
		templateID, _ := strconv.Atoi(templateIDStr)
		if err := models.GetTemplate(templateID, &template); err == gorm.ErrRecordNotFound || alertID != template.AlertID {
			this.outputError(http.StatusNotFound, errorMsg404)
		} else if err != nil {
			controllerLogger.Printf("GetTemplate failed: %s", err.Error())
			this.outputError(http.StatusInternalServerError, errorMsg500)
		} else {
			this.outputSuccess(http.StatusOK, &template)
		}
	}
	this.ServeJSON()
}
