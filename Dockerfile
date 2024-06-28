# Stage 1: Build the project
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the project
RUN npm run build

# Stage 2: Create a minimal production image
FROM node:18-alpine AS runner

# Set the working directory
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy only package.json and package-lock.json to install production dependencies
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy only the build artifacts from the previous stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

# Expose the port your application listens on
EXPOSE 3000

# Start your application
CMD ["npm", "run", "start"]
