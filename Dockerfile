# Stage 1: Build the React app
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the client files
COPY client ./client

# Build the React app
RUN npm run build --prefix client

# Stage 2: Set up the server
FROM node:18-alpine

# Install tsx globally
RUN npm install -g tsx

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the server files
COPY server ./server

# Copy the built React app from the previous stage
COPY --from=build /app/client/dist ./client/dist

# Expose port 8000
EXPOSE 8000

# Start the server
CMD ["tsx", "server/main.ts"]
