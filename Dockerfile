# Use an official Node.js image as the base image
FROM node:latest AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

# Use the base image for building the app
FROM base AS build

COPY . .

RUN npm run build

# Final stage: Use the base image and copy the built app
FROM base AS final

COPY --from=build /app/dist ./dist

EXPOSE 8000

CMD ["npm", "start"]
