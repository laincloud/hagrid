package controllers

import (
	"bufio"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/laincloud/hagrid/config"
	"github.com/laincloud/hagrid/models"
)

type UserMV struct {
	ID   int
	Name string
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	if session, err := hagridSessions.Get(r, "session-name"); err == nil {
		delete(session.Values, "access_token")
		delete(session.Values, "user_name")
		session.Save(r, w)
	}
	http.Redirect(w, r, "/", http.StatusMovedPermanently)
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	session, err := hagridSessions.Get(r, "session-name")
	if err != nil {
		session, _ = hagridSessions.New(r, "session-name")

	}
	if token, exists := session.Values["access_token"]; !exists {
		code := r.URL.Query().Get("code")
		if code == "" {
			redirectToSSO(w, r)
			return
		}
		v := url.Values{}
		v.Set("code", code)
		v.Set("client_id", strconv.Itoa(config.GetAuthClientID()))
		v.Set("client_secret", config.GetAuthSecret())
		v.Set("redirect_uri", config.GetAuthRedirectURI())
		v.Set("grant_type", "authorization_code")
		client := http.DefaultClient
		var (
			resp      *http.Response
			respBytes []byte
			userName  string
		)
		resp, err = client.Get(fmt.Sprintf("%s/oauth2/token?%s", config.GetAuthSSOURL(), v.Encode()))
		if err == nil {
			defer resp.Body.Close()
			if respBytes, err = ioutil.ReadAll(resp.Body); err == nil {
				caResp := make(map[string]interface{})
				if err = json.Unmarshal(respBytes, &caResp); err == nil {
					if token, exists = caResp["access_token"]; exists {
						session.Values["access_token"] = token
						if userName, err = getUserNameFromSSO(token.(string)); err == nil {
							session.Values["user_name"] = userName
							if err = models.AddUserIfNotExists(userName); err == nil {
								err = session.Save(r, w)
							}
						}
					}
				}
			}
		}

	}
	if err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var file *os.File
	if file, err = os.Open("index.html"); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer file.Close()
	bfRd := bufio.NewReader(file)
	var data []byte
	if data, err = ioutil.ReadAll(bfRd); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func GetUserHandler(w http.ResponseWriter, r *http.Request) {
	var userName string
	var err error
	if userName, err = getAuthedUserInfo(r); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Authorization failed, please login first"))
		return
	}
	user := &models.User{}

	if err = models.GetUser(userName, user); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.WriteHeader(http.StatusOK)
	data, _ := json.Marshal(user)
	w.Write(data)
}

func GetAllUsersHandler(w http.ResponseWriter, r *http.Request) {
	var (
		users []models.User
		err   error
		data  []byte
	)

	namePattern := fmt.Sprintf("%%%s%%", r.URL.Query().Get("name"))
	if err = models.GetAllUsers(&users, namePattern); err != nil {
		writeResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	briefUsers := make([]UserMV, 0, len(users))
	for _, user := range users {
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

func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	var userName string
	var err error
	if userName, err = getAuthedUserInfo(r); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Authorization failed, please login first"))
		return
	}

	user := &models.User{}

	if err = models.GetUser(userName, user); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	if int(user.ID) != id {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("You have not privilege to modify others' profile"))
		return
	}
	user.EmailAddress = r.FormValue("email_address")
	user.BearychatChannel = r.FormValue("bearychat_channel")
	user.BearychatTeam = r.FormValue("bearychat_team")
	user.BearychatToken = r.FormValue("bearychat_token")
	user.SlackChannel = r.FormValue("slack_channel")
	user.SlackTeam = r.FormValue("slack_team")
	user.SlackToken = r.FormValue("slack_token")
	user.PhoneNumber = r.FormValue("phone_number")
	if err = models.UpdateUser(user); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Update user successfully"))
}

func redirectToSSO(w http.ResponseWriter, r *http.Request) {
	v := url.Values{}
	v.Set("response_type", "code")
	v.Set("redirect_uri", config.GetAuthRedirectURI())
	v.Set("realm", "hagrid")
	v.Set("client_id", strconv.Itoa(config.GetAuthClientID()))
	v.Set("scope", "write:group")
	v.Set("state", fmt.Sprintf("%d", time.Now().Unix()))
	http.Redirect(w, r, fmt.Sprintf("%s/oauth2/auth?%s", config.GetAuthSSOURL(), v.Encode()), http.StatusFound)
}

func getUserNameFromSSO(token string) (string, error) {
	var (
		req       *http.Request
		resp      *http.Response
		respBytes []byte
		err       error
		userName  string
	)
	if req, err = http.NewRequest("GET", fmt.Sprintf("%s/api/me", config.GetAuthSSOURL()), nil); err == nil {
		req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", token))
		if resp, err = http.DefaultClient.Do(req); err == nil {
			defer resp.Body.Close()
			if respBytes, err = ioutil.ReadAll(resp.Body); err == nil {
				caResp := make(map[string]interface{})
				if err = json.Unmarshal(respBytes, &caResp); err == nil {
					if userNameObj, exists := caResp["name"]; exists {
						userName = userNameObj.(string)
					} else {
						err = errors.New("Username is empty")
					}
				}
			}
		}
	}
	return userName, err
}
