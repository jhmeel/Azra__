# Stage 1: Build the React app
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

COPY ..

RUN npm install 


# Build the React app
RUN npm run build 


# Set environment variable to production
ENV NODE_ENV=production
# Expose port 8000
EXPOSE 8000

# Start the server
CMD ["tsx", "src/server/main.ts"]
