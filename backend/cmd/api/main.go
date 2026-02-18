package main

import (
	"log"
	"os"

	"incident-report-app/backend/internal/db"
	"incident-report-app/backend/internal/handlers"
	"incident-report-app/backend/internal/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	pool, err := db.NewPool()
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	r := gin.Default()

	origin := os.Getenv("CORS_ORIGIN")
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-Owner-Id")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	h := handlers.NewIncidentHandler(pool)

	api := r.Group("/api")
	{
		api.GET("/incidents", h.List)
		api.POST("/incidents", middleware.RequireOwner(), h.Create)
		api.PUT("/incidents/:id", h.Update)
		api.DELETE("/incidents/:id", middleware.RequireOwner(), h.Delete)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Fatal(r.Run(":" + port))
}
