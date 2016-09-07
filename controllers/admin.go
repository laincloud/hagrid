package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/laincloud/hagrid/models"
)

func AddAdminHandler(w http.ResponseWriter, r *http.Request) {
	alertID, _ := strconv.Atoi(r.URL.Query().Get("alert_id"))
	var adminID int

	_, err := authorize(w, r, alertID)
	if err != nil {
		return
	}

	if adminID, err = strconv.Atoi(r.FormValue("adminID")); err != nil {
		writeResponse(w, "Field user_id must be an integer", http.StatusBadRequest)
		return
	}

	if models.IsAdminDuplicated(alertID, adminID) {
		writeResponse(w, "The admin is duplicated in this alert", http.StatusConflict)
		return
	}

	if err = models.AddAdmin(alertID, adminID); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeResponse(w, "Add administrator successfully", http.StatusCreated)
}

func DeleteAdminHandler(w http.ResponseWriter, r *http.Request) {

	alertID, _ := strconv.Atoi(r.URL.Query().Get("alert_id"))

	user, err := authorize(w, r, alertID)
	if err != nil {
		return
	}

	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	if id == user.ID {
		writeResponse(w, "You can't delete yourself!", http.StatusForbidden)
		return
	}

	if err = models.DeleteAdmin(alertID, id); err != nil {
		writeResponse(w, err.Error(), http.StatusForbidden)
		return
	}
	writeResponse(w, "Delete administrator successfully", http.StatusNoContent)
}

func GetAdminsHandler(w http.ResponseWriter, r *http.Request) {
	alertID, _ := strconv.Atoi(r.URL.Query().Get("alert_id"))
	var (
		admins []models.User
		err    error
		data   []byte
	)

	if err = models.GetAdminsByAlertID(alertID, &admins); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	briefUsers := make([]UserMV, 0, len(admins))
	for _, user := range admins {
		briefUsers = append(
			briefUsers,
			UserMV{
				ID:   user.ID,
				Name: user.Name,
			},
		)
	}
	if data, err = json.Marshal(briefUsers); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
