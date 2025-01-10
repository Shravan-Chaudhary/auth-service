# syntax=docker/dockerfile:1
ARG NODE_VERSION=21.7.1

FROM node:${NODE_VERSION}-alpine AS builder

# Install pnpm first as root
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /home/node/app

# Install dependencies using pnpm
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:${NODE_VERSION}-alpine AS runner

# Install pnpm as root first
RUN corepack enable && corepack prepare pnpm@latest --activate

# Then switch to node user
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
ENV NODE_ENV=production

# Install production dependencies
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=builder --chown=node:node /home/node/app/dist ./
EXPOSE 5501
CMD ["node", "src/server.js"]