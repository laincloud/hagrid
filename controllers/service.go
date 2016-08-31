package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/laincloud/hagrid/models"
)

func AddServiceHandler(w http.ResponseWriter, r *http.Request) {

	alertID, _ := strconv.Atoi(r.FormValue("alertID"))

	if _, err := authorize(w, r, alertID); err != nil {
		return
	}

	enabled, _ := strconv.ParseBool(r.FormValue("enabled"))
	if r.FormValue("name") == "" {
		writeResponse(w, "Service name is empty", http.StatusBadRequest)
		return
	}

	if models.IsServiceDuplicated(r.FormValue("name"), alertID, 0) {
		writeResponse(w, "The service name is duplicated in this alert", http.StatusConflict)
		return
	}

	if r.FormValue("warning") == "" {
		writeResponse(w, "Warning threshold is empty", http.StatusBadRequest)
		return
	}
	if r.FormValue("critical") == "" {
		writeResponse(w, "Critical threshold is empty", http.StatusBadRequest)
		return
	}

	if r.FormValue("metric") == "" {
		writeResponse(w, "Metric is empty", http.StatusBadRequest)
		return
	}

	if strings.Count(r.FormValue("metric"), "$") > 1 {
		writeResponse(w, "You should specify at most one template variable", http.StatusBadRequest)
		return
	}

	if _, err := strconv.ParseFloat(r.FormValue("warning"), 32); err != nil {
		writeResponse(w, "Warning threshold must be a float", http.StatusBadRequest)
		return
	}

	if _, err := strconv.ParseFloat(r.FormValue("critical"), 32); err != nil {
		writeResponse(w, "Critical threshold must be a float", http.StatusBadRequest)
		return
	}

	checkType := r.FormValue("checkType")
	if checkType != models.Equal && checkType != models.Greater && checkType != models.Less && checkType != models.NotEqual {
		writeResponse(w, "CheckType must be one of the >, !=, < and ==", 422)
		return
	}

	checkAttempts, err := strconv.Atoi(r.FormValue("checkAttempts"))
	if err != nil {
		writeResponse(w, "CheckAttempts must be an integer", 422)
		return
	}
	if checkAttempts < 1 {
		writeResponse(w, "CheckAttempts must not be less than 1", http.StatusBadRequest)
	}

	service := &models.Service{
		Name:          r.FormValue("name"),
		Enabled:       enabled,
		Metric:        r.FormValue("metric"),
		Warning:       r.FormValue("warning"),
		Critical:      r.FormValue("critical"),
		CheckAttempts: checkAttempts,
		AlertID:       alertID,
		CheckType:     checkType,
	}

	if err := models.SaveService(service); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeResponse(w, "Add service successfully", http.StatusCreated)
}

func GetServiceHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	var (
		err     error
		data    []byte
		service models.Service
	)
	if err = models.GetService(id, &service); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if data, err = json.Marshal(service); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func GetAllServicesHandler(w http.ResponseWriter, r *http.Request) {
	alertID, _ := strconv.Atoi(r.URL.Query().Get("alert_id"))
	var (
		services []models.Service
		err      error
		data     []byte
	)

	if err = models.GetAllServicesByAlertID(alertID, &services); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if data, err = json.Marshal(services); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func UpdateServiceHandler(w http.ResponseWriter, r *http.Request) {

	var (
		service models.Service
		err     error
	)
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	if err = models.GetService(id, &service); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if _, err = authorize(w, r, service.AlertID); err != nil {
		return
	}

	enabled, _ := strconv.ParseBool(r.FormValue("enabled"))
	if r.FormValue("name") == "" {
		writeResponse(w, "Service name is empty", http.StatusBadRequest)
		return
	}
	if models.IsServiceDuplicated(r.FormValue("name"), service.AlertID, service.ID) {
		writeResponse(w, "The service name is duplicated in this alert", http.StatusConflict)
		return
	}
	if r.FormValue("warning") == "" {
		writeResponse(w, "Warning threshold is empty", http.StatusBadRequest)
		return
	}
	if r.FormValue("critical") == "" {
		writeResponse(w, "Critical threshold is empty", http.StatusBadRequest)
		return
	}

	if r.FormValue("metric") == "" {
		writeResponse(w, "Metric is empty", http.StatusBadRequest)
		return
	}

	if strings.Count(r.FormValue("metric"), "$") > 1 {
		writeResponse(w, "You should specify at most one template variable", http.StatusBadRequest)
		return
	}

	if _, err = strconv.ParseFloat(r.FormValue("warning"), 32); err != nil {
		writeResponse(w, "Warning threshold must be a float", http.StatusBadRequest)
		return
	}

	if _, err = strconv.ParseFloat(r.FormValue("critical"), 32); err != nil {
		writeResponse(w, "Critical threshold must be a float", http.StatusBadRequest)
		return
	}

	checkType := r.FormValue("checkType")
	if checkType != models.Equal && checkType != models.Greater && checkType != models.Less && checkType != models.NotEqual {
		writeResponse(w, "CheckType must be one of the >, !=, < and ==", 422)
		return
	}

	checkAttempts, err := strconv.Atoi(r.FormValue("checkAttempts"))
	if err != nil {
		writeResponse(w, "CheckAttempts must be an integer", 422)
		return
	}
	if checkAttempts < 1 {
		writeResponse(w, "CheckAttempts must not be less than 1", http.StatusBadRequest)
	}

	service.Name = r.FormValue("name")
	service.Enabled = enabled
	service.Metric = r.FormValue("metric")
	service.Warning = r.FormValue("warning")
	service.Critical = r.FormValue("critical")
	service.CheckAttempts = checkAttempts
	service.CheckType = checkType

	if err = models.SaveService(&service); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeResponse(w, "Update service successfully", http.StatusAccepted)
}

func DeleteServiceHandler(w http.ResponseWriter, r *http.Request) {

	var service models.Service
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	if err := models.GetService(id, &service); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if _, err := authorize(w, r, service.AlertID); err != nil {
		return
	}

	models.DeleteService(id)
	writeResponse(w, "Delete service successfully", http.StatusNoContent)
}
