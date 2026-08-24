# =====================================================
# KPPSM Backend API & Static Web - Node.js Dockerfile
# =====================================================

FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application files
COPY index.html ./
COPY assets/ ./assets/
COPY src/ ./src/
COPY docs/ ./docs/

# Environment variables
ENV NODE_ENV=production \
    PORT=3000

# Expose port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

# Start the application
CMD ["node", "src/server-api.js"]
