# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app


COPY package.json bun.lockb 
COPY prisma ./prisma/

RUN  bun install 
RUN  bun run migrate:deploy
COPY . .

ENV NODE_ENV=production
EXPOSE 5000
ENTRYPOINT [ "bun", "run", "index.ts" ]