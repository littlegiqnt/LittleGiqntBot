FROM node:lts-alpine AS base

WORKDIR /bot
ARG TOKEN
ENV TOKEN=${TOKEN}

COPY dist/ node_modules/ package.json ./
RUN echo "\nTOKEN=${TOKEN}" >> .env

CMD NODE_ENV=production NODE_PATH=./dist node dist/index.js
