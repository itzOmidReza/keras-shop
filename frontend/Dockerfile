# Stage 1: Build Nuxt 4 application with Bun
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json bun.lock* ./

# Install dependencies with strict frozen lockfile
RUN bun install --frozen-lockfile

# Copy frontend source code
COPY . .

# Build self-contained standalone Nitro output bundle
ENV NODE_ENV=production
RUN bun run build

# Stage 2: Minimal hardened Node.js Alpine runtime runner
FROM node:22-alpine AS runner

WORKDIR /app

# Environment defaults for production deployment
ENV NODE_ENV=production \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000 \
    PORT=3000

# Install curl for robust container health checks
RUN apk add --no-cache curl

# Copy compiled Nitro bundle with non-root node ownership
COPY --from=builder --chown=node:node /app/.output /app/.output

# Run as non-root user
USER node

EXPOSE 3000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://127.0.0.1:3000/ || exit 1

CMD ["node", ".output/server/index.mjs"]

