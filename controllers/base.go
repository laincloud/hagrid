package controllers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
)

const (
	succMsg204  = "Delete entity successfully."
	errorMsg403 = "The operation is forbidden."
	errorMsg404 = "The entity is not found."
	errorMsg409 = "The entity is duplicated."
	errorMsg500 = "Operation failed. Ask admin for help."
)

var controllerLogger = logs.GetLogger("CONTROLLER ERROR")

type NestPreparer interface {
	NestPrepare()
}

type BaseController struct {
	beego.Controller
}

func (this *BaseController) outputError(retCode int, errMsg string) {
	this.Data["json"] = map[string]string{"error": errMsg}
	this.Ctx.Output.SetStatus(retCode)
}

func (this *BaseController) outputSuccess(retCode int, data interface{}) {
	this.Data["json"] = data
	this.Ctx.Output.SetStatus(retCode)
}
