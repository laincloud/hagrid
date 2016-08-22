package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/laincloud/hagrid/models"
)

func AddNotifierHandler(w http.ResponseWriter, r *http.Request) {
	alertID, _ := strconv.Atoi(r.URL.Query().Get("alert_id"))
	var (
		notifierID int
		err        error
	)

	if _, err = authorize(w, r, alertID); err != nil {
		return
	}

	if notifierID, err = strconv.Atoi(r.FormValue("notifierID")); err != nil {
		writeResponse(w, "Field user_id must be an integer", http.StatusBadRequest)
		return
	}
	if err = models.AddNotifier(alertID, notifierID); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeResponse(w, "Add notifier successfully", http.StatusCreated)
}

func DeleteNotifierHandler(w http.ResponseWriter, r *http.Request) {
	alertID, _ := strconv.Atoi(r.URL.Query().Get("alert_id"))

	if _, err := authorize(w, r, alertID); err != nil {
		return
	}

	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	if err := models.DeleteNotifier(alertID, id); err != nil {
		writeResponse(w, err.Error(), http.StatusForbidden)
		return
	}
	writeResponse(w, "Delete notifier successfully", http.StatusNoContent)
}

func GetNotifiersHandler(w http.ResponseWriter, r *http.Request) {
	alertID, _ := strconv.Atoi(r.URL.Query().Get("alert_id"))
	var (
		notifiers []models.User
		err       error
		data      []byte
	)

	if err = models.GetNotifiersByAlertID(alertID, &notifiers); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if data, err = json.Marshal(notifiers); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
