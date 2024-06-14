# Install dependencies only when needed
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build the client code only
FROM node:18-alpine AS client-builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run Vite + Express
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=client-builder /app/dist ./dist
COPY --from=client-builder /app/src ./src
COPY --from=client-builder /app/package.json ./
EXPOSE 8000
CMD ["npm", "run", "start"]