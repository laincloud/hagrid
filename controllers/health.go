package controllers

import (
	"net/http"

	"github.com/laincloud/hagrid/models"
)

type HealthController struct {
	BaseController
}

func (this *HealthController) Get() {
	health := models.GetHealthStatus()
	this.outputSuccess(http.StatusOK, health)
	this.ServeJSON()
}
