FROM node:lts-alpine AS base

WORKDIR /bot
ARG TOKEN
ARG USER_TOKEN
ENV TOKEN=${TOKEN} \
    USER_TOKEN=${USER_TOKEN}

COPY ./ ./
RUN echo "\nTOKEN=${TOKEN}" >> .env

ENTRYPOINT npm start
