# === Base Stage ===
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# === Dependencies Stage ===
FROM base AS deps
RUN npm install

# === Build Stage ===
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate
RUN npm run build

# === Production Stage ===
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY .env .env

CMD ["node", "dist/src/server.js"]
