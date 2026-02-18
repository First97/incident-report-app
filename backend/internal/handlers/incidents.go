package handlers

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"incident-report-app/backend/internal/middleware"
	"incident-report-app/backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type IncidentHandler struct {
	DB *pgxpool.Pool
}

func NewIncidentHandler(db *pgxpool.Pool) *IncidentHandler {
	return &IncidentHandler{DB: db}
}

func validCategory(v string) bool {
	return v == "Safety" || v == "Maintenance"
}
func validStatus(v string) bool {
	return v == "Open" || v == "In Progress" || v == "Success"
}

func (h *IncidentHandler) List(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	rows, err := h.DB.Query(ctx, `
		SELECT id, title, description, category, status, created_at, updated_at
		FROM incidents
		ORDER BY created_at DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db query failed"})
		return
	}
	defer rows.Close()

	out := make([]models.Incident, 0)
	for rows.Next() {
		var it models.Incident
		if err := rows.Scan(&it.ID, &it.Title, &it.Description, &it.Category, &it.Status, &it.CreatedAt, &it.UpdatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "row scan failed"})
			return
		}
		out = append(out, it)
	}
	c.JSON(http.StatusOK, out)
}

func (h *IncidentHandler) Create(c *gin.Context) {
	owner := c.GetString(middleware.OwnerKey)

	var req models.IncidentCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
		return
	}
	if len(req.Title) < 3 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "title must be at least 3 characters"})
		return
	}
	if !validCategory(req.Category) || !validStatus(req.Status) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid category or status"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var it models.Incident
	err := h.DB.QueryRow(ctx, `
		INSERT INTO incidents (title, description, category, status, owner_id)
		VALUES ($1,$2,$3,$4,$5)
		RETURNING id, title, description, category, status, created_at, updated_at
	`, req.Title, req.Description, req.Category, req.Status, owner).
		Scan(&it.ID, &it.Title, &it.Description, &it.Category, &it.Status, &it.CreatedAt, &it.UpdatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "insert failed"})
		return
	}
	c.JSON(http.StatusCreated, it)
}

func (h *IncidentHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	var req models.IncidentUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
		return
	}
	if len(req.Title) < 3 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "title must be at least 3 characters"})
		return
	}
	if !validCategory(req.Category) || !validStatus(req.Status) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid category or status"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var it models.Incident
	err := h.DB.QueryRow(ctx, `
		UPDATE incidents
		SET title=$1, description=$2, category=$3, status=$4, updated_at=NOW()
		WHERE id=$5
		RETURNING id, title, description, category, status, created_at, updated_at
	`, req.Title, req.Description, req.Category, req.Status, id).
		Scan(&it.ID, &it.Title, &it.Description, &it.Category, &it.Status, &it.CreatedAt, &it.UpdatedAt)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "incident not found"})
		return
	}
	c.JSON(http.StatusOK, it)
}

func (h *IncidentHandler) Delete(c *gin.Context) {
	owner := c.GetString(middleware.OwnerKey)
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	tag, err := h.DB.Exec(ctx, `
		DELETE FROM incidents
		WHERE id=$1 AND owner_id=$2
	`, id, owner)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "delete failed"})
		return
	}
	if tag.RowsAffected() == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "cannot delete incident (not owner or not found)"})
		return
	}
	c.Status(http.StatusNoContent)
}
