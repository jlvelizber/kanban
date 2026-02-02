# Backend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/tsconfig.json ./server/

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy server source code
COPY server ./server

# Build TypeScript - this outputs to /app/dist (outDir is ../dist relative to server)
RUN npm run build:server

# Verify build output exists and show structure
RUN echo "=== Build output structure ===" && \
    find /app/dist -type f -name "*.js" 2>/dev/null | head -20 || \
    (echo "No JS files found in dist, checking all:" && find /app -name "*.js" -type f | head -20)

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files from builder - check both possible locations
COPY --from=builder /app/dist ./dist

# Copy schema file for initialization (needed at runtime)
COPY server/db ./server/db

# Verify the server/index.js file exists
RUN if [ ! -f "dist/server/index.js" ]; then \
      echo "ERROR: dist/server/index.js not found!" && \
      echo "Searching for index.js:" && \
      find dist -name "index.js" -type f && \
      echo "Contents of dist:" && \
      ls -la dist/ && \
      exit 1; \
    fi && \
    echo "✓ Found dist/server/index.js"

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "dist/server/index.js"]

