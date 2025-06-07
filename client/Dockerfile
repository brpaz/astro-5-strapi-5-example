FROM node:22-alpine AS builder

ARG STRAPI_URL="http://localhost:1337"
ENV STRAPI_URL=${STRAPI_URL}

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM node:22-alpine AS development
WORKDIR /app

COPY pnpm-lock.yaml package.json ./

RUN corepack enable && corepack install && \
    pnpm install --frozen-lockfile

COPY . .

COPY docker/dev-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["pnpm", "run", "dev"]

FROM node:22-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

RUN corepack enable && corepack install && \
    pnpm install --frozen-lockfile --prod

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]