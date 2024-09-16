FROM node:20.10.0-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV NODE_ENV="production"
ENV PATH="$PNPM_HOME:$PATH"
ENV PORT=3000

RUN corepack enable

WORKDIR /app

COPY . .

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# FROM base AS build
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --dev
# RUN pnpm run api build

FROM base
COPY --from=prod-deps /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000

CMD ["pnpm", "run", "start"]