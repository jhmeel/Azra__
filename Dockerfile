
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


FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production


COPY --from=deps /app/node_modules ./node_modules
COPY --from=client-builder /app/dist ./dist
COPY --from=client-builder /app/src ./src
COPY --from=client-builder /app/package.json ./package.json

EXPOSE 3000

# Use a health check to ensure the container is running correctly
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD ["curl", "-f", "http://localhost:3000/health"] || exit 1

CMD ["npm", "run", "start"]
