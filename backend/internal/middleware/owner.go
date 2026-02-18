package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

const OwnerHeader = "X-Owner-Id"
const OwnerKey = "ownerId"

func RequireOwner() gin.HandlerFunc {
	return func(c *gin.Context) {
		owner := c.GetHeader(OwnerHeader)
		if owner == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "missing X-Owner-Id header"})
			c.Abort()
			return
		}
		c.Set(OwnerKey, owner)
		c.Next()
	}
}
