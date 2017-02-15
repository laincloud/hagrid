package models

type Health struct {
	Icinga2Alive bool
}

func GetHealthStatus() *Health {
	currentHealth := &Health{
		Icinga2Alive: true,
	}
	if err := icinga2Client.CheckHealth(); err != nil {
		currentHealth.Icinga2Alive = false
	}
	return currentHealth
}
