# Use the official Bun image
# See all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only necessary files for installation
COPY package.json bun.lockb ./
COPY prisma ./prisma/

# Install dependencies and apply Prisma migrations
RUN bun install

# Copy all server files
COPY . .

# Set environment variables and expose the port
ENV NODE_ENV=production
EXPOSE 5000

# Set the entrypoint for the server
ENTRYPOINT [ "bun", "run", "index.ts" ]
