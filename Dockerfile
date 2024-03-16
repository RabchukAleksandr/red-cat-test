FROM node:18-alpine AS base

RUN npm i -g pnpm

FROM base AS dependendencies
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependendencies /app/node_modules node_modules

RUN pnpm build
RUN prune --prod

FROM base as deploy
WORKDIR /app
COPY --from=build /app/dist dist
COPY --from=build /app/node_modules node_modules

CMD ["node", "dist/main.js"]

