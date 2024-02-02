# syntax=docker/dockerfile:1

ARG NODE_VERSION=lts

FROM node:${NODE_VERSION}-alpine as base

FROM base as deps

WORKDIR /tmp

COPY .yarn .yarn

COPY .yarnrc.yml package.json yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --immutable

FROM base as builder 

WORKDIR /usr/src/app

COPY --from=deps /tmp/node_modules ./node_modules

COPY . .

RUN yarn build

FROM nginx:latest 

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html