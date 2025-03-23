# Use a Node.js Alpine image for the builder stage
FROM node:20-alpine AS builder

WORKDIR /app

# # Install dependencies for node-gyp (if needed)
# RUN apk add --no-cache python3 make g++

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set a dummy MongoDB URI for build time only
ENV MONGODB_URI=mongodb://localhost:27017/53one

# Build the application
RUN npm run build

# Remove development dependencies to reduce size
RUN npm prune --production

# Use another Node.js Alpine image for the final stage
FROM node:20-alpine

WORKDIR /app

# Set environment variables
ENV NODE_ENV=development

# Copy built application from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose the port the app will run on
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Create a non-root user to run the application
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 sveltekit && \
  chown -R sveltekit:nodejs /app

USER sveltekit

# Start the application
CMD ["node", "build"]
