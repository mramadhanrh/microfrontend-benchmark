# Using oven/bun image doesn't work due to permission issues and different process on the base image
# Run command: docker build -f apps/microfrontend/mfe-web-app/docker/next/Dockerfile -t mfe-web-app:latest .

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

RUN bun run monolith:build

# If you are using the custom server implementation:
CMD ["bun", "run", "monolith:start"]
