# Stage 1: Build the React app
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./
COPY src/client/package.json ./src/client/

# Install dependencies for the client
RUN npm install --prefix src/client

# Copy the client files
COPY src/client ./src/client

# Build the React app
RUN npm run build --prefix src/client

# Stage 2: Set up the server
FROM node:18-alpine

# Install tsx globally
RUN npm install -g tsx

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies for the server
RUN npm install

# Copy the server files
COPY src/server ./src/server

# Copy the built React app from the previous stage
COPY --from=build /app/src/client/dist ./src/client/dist

# Set environment variable to production
ENV NODE_ENV=production
# Expose port 8000
EXPOSE 8000

# Start the server
CMD ["tsx", "src/server/main.ts"]
