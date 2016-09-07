package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/context"
	"github.com/gorilla/mux"
	_ "github.com/laincloud/hagrid/config"
	"github.com/laincloud/hagrid/controllers"
	_ "github.com/laincloud/hagrid/models"
)

func main() {
	path, _ := filepath.Abs(filepath.Dir(os.Args[0]))
	r := mux.NewRouter()

	r.HandleFunc("/", controllers.HomeHandler)
	r.HandleFunc("/logout", controllers.LogoutHandler)

	// Static files
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir(filepath.Join(path, "./static")))))

	// User APIs
	userSubrouter := r.PathPrefix("/api/users").Subrouter()
	userSubrouter.HandleFunc("/", controllers.GetUserHandler).Methods("GET")
	userSubrouter.HandleFunc("/all", controllers.GetAllUsersHandler).Methods("GET")
	userSubrouter.HandleFunc("/{id:[0-9]+}", controllers.UpdateUserHandler).Methods("PUT")

	// Alert APIs
	alertSubrouter := r.PathPrefix("/api/alerts/").Subrouter()
	alertSubrouter.HandleFunc("/", controllers.GetAllAlertsHandler).Methods("GET")
	alertSubrouter.HandleFunc("/{id:[0-9]+}", controllers.GetAlertHandler).Methods("GET")
	alertSubrouter.HandleFunc("/{id:[0-9]+}", controllers.UpdateAlertHandler).Methods("PUT")
	alertSubrouter.HandleFunc("/", controllers.AddAlertHandler).Methods("POST")
	alertSubrouter.HandleFunc("/{id:[0-9]+}", controllers.DeleteAlertHandler).Methods("DELETE")

	// Template APIs ?alert_id=xxx
	templateSubrouter := r.PathPrefix("/api/templates").Subrouter()
	templateSubrouter.HandleFunc("/", controllers.GetAllTemplatesHandler).Methods("GET")
	templateSubrouter.HandleFunc("/{id:[0-9]+}", controllers.GetTemplateHandler).Methods("GET")
	templateSubrouter.HandleFunc("/{id:[0-9]+}", controllers.UpdateTemplateHandler).Methods("PUT")
	templateSubrouter.HandleFunc("/", controllers.AddTemplateHandler).Methods("POST")
	templateSubrouter.HandleFunc("/{id:[0-9]+}", controllers.DeleteTemplateHandler).Methods("DELETE")

	// Service APIs ?alert_id=xxx
	serviceSubrouter := r.PathPrefix("/api/services").Subrouter()
	serviceSubrouter.HandleFunc("/", controllers.GetAllServicesHandler).Methods("GET")
	serviceSubrouter.HandleFunc("/{id:[0-9]+}", controllers.GetServiceHandler).Methods("GET")
	serviceSubrouter.HandleFunc("/{id:[0-9]+}", controllers.UpdateServiceHandler).Methods("PUT")
	serviceSubrouter.HandleFunc("/", controllers.AddServiceHandler).Methods("POST")
	serviceSubrouter.HandleFunc("/{id:[0-9]+}", controllers.DeleteServiceHandler).Methods("DELETE")

	// Notifier APIs  ?alert_id=xxx
	notifierSubrouter := r.PathPrefix("/api/notifiers").Subrouter()
	notifierSubrouter.HandleFunc("/", controllers.GetNotifiersHandler).Methods("GET")
	notifierSubrouter.HandleFunc("/", controllers.AddNotifierHandler).Methods("POST")
	notifierSubrouter.HandleFunc("/{id:[0-9]+}", controllers.DeleteNotifierHandler).Methods("DELETE")

	// Admins APIs  ?alert_id=xxx
	adminSubrouter := r.PathPrefix("/api/admins").Subrouter()
	adminSubrouter.HandleFunc("/", controllers.GetAdminsHandler).Methods("GET")
	adminSubrouter.HandleFunc("/", controllers.AddAdminHandler).Methods("POST")
	adminSubrouter.HandleFunc("/{id:[0-9]+}", controllers.DeleteAdminHandler).Methods("DELETE")

	log.Fatal(http.ListenAndServe(":8080", context.ClearHandler(r)))
}
