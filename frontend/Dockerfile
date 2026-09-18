FROM node:24-bookworm-slim AS development-dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-bookworm-slim AS production-dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM development-dependencies AS build
COPY . .
# These values are public and may be embedded in the browser bundle.
# Never pass CLERK_SECRET_KEY or database credentials as build arguments.
ARG VITE_API_BASE_URL
ARG VITE_CLERK_PUBLISHABLE_KEY
RUN test -n "$VITE_API_BASE_URL" || (echo "VITE_API_BASE_URL is required" >&2; exit 1)
RUN test -n "$VITE_CLERK_PUBLISHABLE_KEY" || (echo "VITE_CLERK_PUBLISHABLE_KEY is required" >&2; exit 1)
RUN npm run build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
# Clerk's server middleware also reads the public key at runtime.
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY package.json ./

USER node
EXPOSE 3000
CMD ["node", "./node_modules/@react-router/serve/dist/cli.js", "./build/server/index.js"]
