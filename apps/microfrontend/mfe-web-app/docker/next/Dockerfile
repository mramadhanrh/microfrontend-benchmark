FROM docker.io/node:lts-alpine as deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN npm install -g bun
WORKDIR /usr/src/app
COPY package.json ./
RUN bun install

# Production image, copy all the files and run next
FROM docker.io/node:lts-alpine as runner
RUN apk add --no-cache dumb-init
RUN npm install -g bun

ENV NODE_ENV production
ENV PORT 3000
ENV HOST 0.0.0.0
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /usr/src/app

# Copy installed dependencies from deps stage
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy built application files
COPY ./ ./

RUN bunx nx build mfe-web-app

# Run the application under "node" user by default
# RUN chown -R node:node .
# USER node
# EXPOSE 3000

# If you are using the custom server implementation:
CMD ["dumb-init", "bunx", "nx", "start", "mfe-web-app"]
