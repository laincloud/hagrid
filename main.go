package main

import (
	"github.com/astaxie/beego"
	_ "github.com/go-sql-driver/mysql"
	_ "github.com/laincloud/hagrid/config"
	_ "github.com/laincloud/hagrid/models"
	_ "github.com/laincloud/hagrid/routers"
)

func main() {
	beego.Run()
}
