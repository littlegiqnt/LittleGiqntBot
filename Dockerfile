FROM node:lts-alpine AS base

WORKDIR /bot
ARG TOKEN
ENV TOKEN=${TOKEN}

COPY dist/ node_modules/ package.json ./
RUN echo "\nTOKEN=${TOKEN}" >> .env

ENTRYPOINT npm start
