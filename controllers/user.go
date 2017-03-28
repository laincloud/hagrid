package controllers

import (
	"fmt"
	"net/http"

	"github.com/astaxie/beego/validation"
	"github.com/laincloud/hagrid/config"
	"github.com/laincloud/hagrid/models"
)

type UserController struct {
	AuthController
}

func (this *UserController) NestPrepare() {
	if this.Ctx.Input.IsPut() {
		authUser := this.Ctx.Input.GetData("auth_user").(*models.User)
		if authUser.Name == config.GetSuperUser() {
			this.outputError(http.StatusForbidden, errorMsg403)
			this.ServeJSON()
			this.StopRun()
		}
		validator := validation.Validation{}
		if err := this.ParseForm(authUser); err != nil {
			controllerLogger.Printf("Parsing user form error: %s", err.Error())
			this.outputError(http.StatusInternalServerError, errorMsg500)
			this.ServeJSON()
			this.StopRun()
		} else {
			if authUser.EmailAddress != "" {
				validator.Email(authUser.EmailAddress, "email_address")
			}
			if authUser.PhoneNumber != "" {
				validator.Length(authUser.PhoneNumber, 11, "phone_number")
			}
			if validator.HasErrors() {
				for _, err := range validator.Errors {
					this.outputError(http.StatusBadRequest, fmt.Sprintf("[%s]%s", err.Key, err.Message))
					this.ServeJSON()
					this.StopRun()
				}
			}
		}
	}
}

func (this *UserController) Put() {
	authUser := this.Ctx.Input.GetData("auth_user").(*models.User)
	if err := models.UpdateUser(authUser); err != nil {
		controllerLogger.Printf("Parsing auth_user form error: %s", err.Error())
		this.outputError(http.StatusInternalServerError, errorMsg500)
	} else {
		this.outputSuccess(http.StatusCreated, authUser)
	}
	this.ServeJSON()
}

func (this *UserController) Get() {
	userMode := this.Ctx.Input.Param(":user_mode")
	if userMode == "me" {
		authUser := this.Ctx.Input.GetData("auth_user").(*models.User)
		this.outputSuccess(http.StatusOK, authUser)
	} else {
		namePattern := fmt.Sprintf("%%%s%%", this.Ctx.Input.Query("name"))
		var users []models.User
		if err := models.GetAllUsers(&users, namePattern); err != nil {

		} else {
			this.outputSuccess(http.StatusOK, &users)
		}
	}
	this.ServeJSON()
}
