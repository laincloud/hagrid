package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"strings"

	"github.com/gorilla/mux"
	"github.com/laincloud/hagrid/models"
)

func AddTemplateHandler(w http.ResponseWriter, r *http.Request) {
	alertID, _ := strconv.Atoi(r.FormValue("alertID"))

	if _, err := authorize(w, r, alertID); err != nil {
		return
	}

	if r.FormValue("name") == "" {
		writeResponse(w, "Template name is empty", http.StatusBadRequest)
		return
	}

	if models.IsTemplateDuplicated(r.FormValue("name"), alertID, 0) {
		writeResponse(w, "The template name is duplicated in this alert", http.StatusConflict)
		return
	}

	if r.FormValue("values") == "" {
		writeResponse(w, "You must specify one value at least", http.StatusBadRequest)
		return
	}

	if strings.ContainsRune(r.FormValue("values"), '$') {
		writeResponse(w, "Values can't contain '$'", http.StatusBadRequest)
		return
	}

	template := &models.Template{
		Name:    r.FormValue("name"),
		Values:  r.FormValue("values"),
		AlertID: alertID,
	}

	if err := models.SaveTemplate(template); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeResponse(w, "Add template successfully", http.StatusCreated)
}

func GetTemplateHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	var (
		err      error
		data     []byte
		template models.Template
	)
	if err = models.GetTemplate(id, &template); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if data, err = json.Marshal(template); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func GetAllTemplatesHandler(w http.ResponseWriter, r *http.Request) {
	alertID, _ := strconv.Atoi(r.URL.Query().Get("alert_id"))
	var (
		templates []models.Template
		err       error
		data      []byte
	)

	if err = models.GetAllTemplatesByAlertID(alertID, &templates); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if data, err = json.Marshal(templates); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func UpdateTemplateHandler(w http.ResponseWriter, r *http.Request) {
	var (
		template models.Template
		err      error
	)
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	if err = models.GetTemplate(id, &template); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if _, err = authorize(w, r, template.AlertID); err != nil {
		return
	}

	if r.FormValue("name") == "" {
		writeResponse(w, "Template name is empty", http.StatusBadRequest)
		return
	}

	if models.IsTemplateDuplicated(r.FormValue("name"), template.AlertID, template.ID) {
		writeResponse(w, "The template name is duplicated in this alert", http.StatusConflict)
		return
	}

	if r.FormValue("values") == "" {
		writeResponse(w, "You must specify one value at least", http.StatusBadRequest)
		return
	}

	if strings.ContainsRune(r.FormValue("values"), '$') {
		writeResponse(w, "Values can't contain '$'", http.StatusBadRequest)
		return
	}

	template.Name = r.FormValue("name")
	template.Values = r.FormValue("values")

	if err = models.SaveTemplate(&template); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeResponse(w, "Update template successfully", http.StatusAccepted)
}

func DeleteTemplateHandler(w http.ResponseWriter, r *http.Request) {
	var template models.Template
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	if err := models.GetTemplate(id, &template); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if _, err := authorize(w, r, template.AlertID); err != nil {
		return
	}

	models.DeleteTemplate(id)
	writeResponse(w, "Delete template successfully", http.StatusNoContent)
}
