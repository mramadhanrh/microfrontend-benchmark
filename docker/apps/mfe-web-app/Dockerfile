# Using oven/bun image doesn't work due to permission issues and different process on the base image
# Run command: docker build -f docker/apps/mfe-web-app/Dockerfile -t mfe-web-app:latest .

# Build command: docker buildx build --platform linux/amd64,linux/arm64 -f docker/apps/mfe-web-app/Dockerfile -t mfe-web-app:latest .
# Tag command: docker tag mfe-web-app:latest <registry>/mfe-web-app:latest
# Push command: docker push <registry>/mfe-web-app:latest

FROM docker.io/node:lts-alpine AS deps

RUN npm install -g bun
WORKDIR /usr/src/app
COPY package.json bun.lock ./
RUN bun install

# Production image, copy all the files and run next
FROM docker.io/node:lts-alpine AS runner
RUN npm install -g bun

WORKDIR /usr/src/app

# Copy installed dependencies from deps stage
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy built application files
COPY ./ ./

ENV NODE_ENV=production
RUN bun run mfe:build

# If you are using the custom server implementation:
CMD ["bun", "run", "mfe:start"]
