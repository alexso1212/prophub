# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Enable corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

# Copy dependency manifests first for layer cache
COPY package.json pnpm-lock.yaml .npmrc ./

# Install dependencies (frozen lockfile for reproducibility)
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# Stage 2: Serve
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
