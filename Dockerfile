FROM oven/bun:1-debian AS base
WORKDIR /bot

FROM base AS install
# All dependencies
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile
# Production dependencies
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY . .
ARG TOKEN
ENV TOKEN=${TOKEN}
RUN echo "\nTOKEN=${TOKEN}" >> .env
ENV NODE_ENV=production
ENTRYPOINT [ "bun", "run", "./src/index.ts" ]
