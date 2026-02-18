package models

import "time"

type Incident struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Category    string    `json:"category"` // Safety | Maintenance
	Status      string    `json:"status"`   // Open | In Progress | Success
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	OwnerID     string    `json:"-"`
}

type IncidentCreateRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Status      string `json:"status"`
}

type IncidentUpdateRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Status      string `json:"status"`
}
