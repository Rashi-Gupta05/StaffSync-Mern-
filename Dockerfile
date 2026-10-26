# ---- Build Client ----
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ---- Server & Final Image ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install server dependencies
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev

# Copy server code
COPY server/src/ ./src/

# Copy built frontend from builder stage
COPY --from=client-builder /app/client/dist /app/client/dist

WORKDIR /app

CMD ["node", "server/src/index.js"]
