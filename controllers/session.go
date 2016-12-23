package controllers

import (
	"github.com/gorilla/sessions"
	"github.com/pborman/uuid"
)

var hagridSessions *sessions.CookieStore

func init() {
	hagridSessions = sessions.NewCookieStore(uuid.NewRandom())
}

//func authorize(w http.ResponseWriter, r *http.Request, alertID int) (*models.User, error) {
//	var (
//		userName string
//		err      error
//		hasPriv  bool
//	)
//
//	user := &models.User{}
//	if userName, err = getAuthedUserInfo(r); err != nil {
//		writeResponse(w, "Authorization failed", http.StatusUnauthorized)
//		return nil, err
//	}
//	if err = models.GetUser(userName, user); err != nil {
//		writeResponse(w, err.Error(), http.StatusInternalServerError)
//		return nil, err
//	}
//
//	for _, alert := range user.AdminedAlerts {
//		if alert.ID == alertID {
//			hasPriv = true
//			break
//		}
//	}
//
//	if !hasPriv && user.Name != config.GetSuperUser() {
//		writeResponse(w, "You have no privilege to update objects of this alert", http.StatusForbidden)
//		return nil, errors.New("Authorization failed")
//	}
//	return user, nil
//}
