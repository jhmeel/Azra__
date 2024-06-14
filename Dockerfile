# Stage 1: Build the Vite application
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite application
RUN npm run build

# Stage 2: Compile TypeScript and setup the server
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the built files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/server ./server

# Install TypeScript globally to compile the server code
RUN npm install -g typescript

# Compile the TypeScript server code
RUN tsc -p server/tsconfig.json

EXPOSE 8000

# Set environment variable to production
ENV NODE_ENV=production

# Run the application
CMD ["node", "server/main.js"]
