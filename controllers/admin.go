package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/astaxie/beego/validation"
	"github.com/jinzhu/gorm"
	"github.com/laincloud/hagrid/models"
)

type AdminController struct {
	AuthController
}

func (this *AdminController) NestPrepare() {
	var adminID int
	if this.Ctx.Input.IsPost() {
		validator := validation.Validation{}
		adminIDStr := this.GetString("admin_id")
		validator.Required(adminIDStr, "admin_id")
		validator.Numeric(adminIDStr, "admin_id")
		if validator.HasErrors() {
			for _, err := range validator.Errors {
				this.outputError(http.StatusBadRequest, fmt.Sprintf("[%s]%s", err.Key, err.Message))
				this.ServeJSON()
				this.StopRun()
			}
		}
		adminID, _ = strconv.Atoi(adminIDStr)
	} else {
		adminID, _ = strconv.Atoi(this.Ctx.Input.Param(":admin_id"))
		if this.Ctx.Input.IsDelete() {
			authUser := this.Ctx.Input.GetData("auth_user").(*models.User)
			if authUser.ID == adminID {
				this.outputError(http.StatusForbidden, errorMsg403)
				this.ServeJSON()
				this.StopRun()
			}
		}
	}
	if isSuper, err := models.IsSuperUser(adminID); isSuper {
		this.outputError(http.StatusForbidden, errorMsg403)
		this.ServeJSON()
		this.StopRun()
	} else if err != nil {
		this.outputError(http.StatusInternalServerError, errorMsg500)
		this.ServeJSON()
		this.StopRun()
	} else {
		this.Ctx.Input.SetData("adminID", adminID)
	}
}

func (this *AdminController) Post() {
	adminID := this.Ctx.Input.GetData("adminID").(int)
	alertID, _ := strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
	if err := models.AddAdmin(alertID, adminID); err == models.ErrorDuplicatedName {
		this.outputError(http.StatusConflict, errorMsg409)
	} else if err == gorm.ErrRecordNotFound {
		this.outputError(http.StatusNotFound, errorMsg404)
	} else if err != nil {
		controllerLogger.Printf("PostAdmin failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusCreated, map[string]string{
			"message": "Add admin successfully",
		})
	}
	this.ServeJSON()
}

func (this *AdminController) Delete() {
	adminID := this.Ctx.Input.GetData("adminID").(int)
	alertID, _ := strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
	if err := models.DeleteAdmin(alertID, adminID); err == gorm.ErrRecordNotFound {
		this.outputError(http.StatusNotFound, errorMsg404)
	} else if err != nil {
		controllerLogger.Printf("DeleteAdmin failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusNoContent, succMsg204)
	}
	this.ServeJSON()
}

func (this *AdminController) Get() {
	alertID, _ := strconv.Atoi(this.Ctx.Input.Param(":alert_id"))
	var admins []models.User
	if err := models.GetAdminsByAlertID(alertID, &admins); err == gorm.ErrRecordNotFound {
		this.outputError(http.StatusNotFound, errorMsg404)
	} else if err != nil {
		controllerLogger.Printf("GetAdmins failed: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusOK, &admins)
	}
	this.ServeJSON()
}
