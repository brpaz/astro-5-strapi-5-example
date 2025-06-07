FROM node:22-alpine3.22 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
ENV NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git > /dev/null 2>&1

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM base AS production
ENV NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apk add --no-cache vips-dev

COPY --from=build /app/ /app/
COPY --from=prod-deps /app/node_modules /app/node_modules

RUN chown -R node:node /app
USER node
EXPOSE 1337
CMD [ "pnpm", "start" ]