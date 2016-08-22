package controllers

import (
	"errors"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/laincloud/hagrid/config"
	"github.com/laincloud/hagrid/models"
	"github.com/pborman/uuid"
)

var hagridSessions *sessions.CookieStore

func init() {
	hagridSessions = sessions.NewCookieStore(uuid.NewRandom())
}

func getAuthedUserInfo(r *http.Request) (string, error) {

	session, err := hagridSessions.Get(r, "session-name")
	if err != nil {
		return "", err
	}
	var userName string
	var ok bool
	userNameObj, exists := session.Values["user_name"]
	if !exists {
		return "", errors.New("Username is empty")
	}
	if userName, ok = userNameObj.(string); !ok {
		return "", errors.New("Username is null")
	}
	return userName, nil
}

func authorize(w http.ResponseWriter, r *http.Request, alertID int) (*models.User, error) {
	var (
		userName string
		err      error
		hasPriv  bool
	)

	user := &models.User{}
	if userName, err = getAuthedUserInfo(r); err != nil {
		writeResponse(w, "Authorization failed", http.StatusUnauthorized)
		return nil, err
	}
	if err = models.GetUser(userName, user); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return nil, err
	}

	for _, alert := range user.AdminedAlerts {
		if alert.ID == alertID {
			hasPriv = true
			break
		}
	}

	if !hasPriv && user.Name != config.GetSuperUser() {
		writeResponse(w, "You have no privilege to update objects of this alert", http.StatusForbidden)
		return nil, errors.New("Authorization failed")
	}
	return user, nil
}

func writeResponse(w http.ResponseWriter, msg string, status int) {
	w.WriteHeader(status)
	w.Write([]byte(msg))
}
