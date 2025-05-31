# Use Node.js 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Set environment variables for Node.js
ENV NODE_OPTIONS="--openssl-legacy-provider"

# Install dependencies with clean npm cache and production only
RUN npm cache clean --force && \
    npm ci --only=production --no-audit

# Copy source code
COPY . .

# Build the React app with optimizations
RUN npm run build

# Use nginx for serving static files
FROM nginx:alpine

# Copy built app
COPY --from=0 /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 