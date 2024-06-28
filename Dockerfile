# Stage 1: Build the project
FROM node:alpine3.17 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the project
RUN npm run build

# Stage 2: Create a minimal production image
FROM node:alpine3.17 AS deploy

# Set the working directory
WORKDIR /app

COPY package.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy only the build artifacts from the previous stage
COPY --from=builder /app/dist ./dist

RUN ls
# Expose the port your application listens on (if needed)
EXPOSE 3000

# Start your application
CMD ["npm","run", "start"]