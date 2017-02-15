package routers

import (
	"github.com/astaxie/beego"
	"github.com/laincloud/hagrid/controllers"
)

func init() {
	apiNs := beego.NewNamespace("/api",
		beego.NSNamespace("/alerts",
			beego.NSRouter("/", &controllers.AlertController{}, "post:Post"),
			beego.NSRouter("/:alert_id([0-9]+|all)", &controllers.AlertController{}, "get:Get"),
			beego.NSRouter("/:alert_id([0-9]+)", &controllers.AlertController{}, "put:Put"),
			beego.NSRouter("/:alert_id([0-9]+)", &controllers.AlertController{}, "delete:Delete"),
		),
		beego.NSNamespace("/alerts/:alert_id([0-9]+)/graphiteservices",
			beego.NSRouter("/", &controllers.GraphiteServiceController{}, "post:Post"),
			beego.NSRouter("/:gs_id([0-9]+|all)", &controllers.GraphiteServiceController{}, "get:Get"),
			beego.NSRouter("/:gs_id([0-9]+)", &controllers.GraphiteServiceController{}, "put:Put"),
			beego.NSRouter("/:gs_id([0-9]+)", &controllers.GraphiteServiceController{}, "delete:Delete"),
		),
		beego.NSNamespace("/alerts/:alert_id([0-9]+)/tcpservices",
			beego.NSRouter("/", &controllers.TCPServiceController{}, "post:Post"),
			beego.NSRouter("/:tcps_id([0-9]+|all)", &controllers.TCPServiceController{}, "get:Get"),
			beego.NSRouter("/:tcps_id([0-9]+)", &controllers.TCPServiceController{}, "put:Put"),
			beego.NSRouter("/:tcps_id([0-9]+)", &controllers.TCPServiceController{}, "delete:Delete"),
		),
		beego.NSNamespace("/alerts/:alert_id([0-9]+)/templates",
			beego.NSRouter("/", &controllers.TemplateController{}, "post:Post"),
			beego.NSRouter("/:template_id([0-9]+|all)", &controllers.TemplateController{}, "get:Get"),
			beego.NSRouter("/:template_id([0-9]+)", &controllers.TemplateController{}, "put:Put"),
			beego.NSRouter("/:template_id([0-9]+)", &controllers.TemplateController{}, "delete:Delete"),
		),
		beego.NSNamespace("/alerts/:alert_id([0-9]+)/notifiers",
			beego.NSRouter("/", &controllers.NotifierController{}, "post:Post"),
			beego.NSRouter("/all", &controllers.NotifierController{}, "get:Get"),
			beego.NSRouter("/:notifier_id([0-9]+)", &controllers.NotifierController{}, "delete:Delete"),
		),
		beego.NSNamespace("/alerts/:alert_id([0-9]+)/admins",
			beego.NSRouter("/", &controllers.AdminController{}, "post:Post"),
			beego.NSRouter("/all", &controllers.AdminController{}, "get:Get"),
			beego.NSRouter("/:admin_id([0-9]+)", &controllers.AdminController{}, "delete:Delete"),
		),
		beego.NSNamespace("/users",
			beego.NSRouter("/:user_mode(me|all)", &controllers.UserController{}, "get:Get"),
			beego.NSRouter("/", &controllers.UserController{}, "put:Put"),
		),
		beego.NSNamespace("/health",
			beego.NSRouter("/", &controllers.HealthController{}, "get:Get"),
		),
	)
	beego.AddNamespace(apiNs)
	beego.Router("/", &controllers.SiteController{}, "get:Home")
	beego.Router("/logout", &controllers.SiteController{}, "get:Logout")

}
