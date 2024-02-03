# syntax=docker/dockerfile:1

ARG NODE_VERSION=lts
ARG NGINX_TAG=alpine

FROM node:${NODE_VERSION}-alpine as base

FROM base as deps

WORKDIR /tmp

COPY .yarn .yarn

COPY .yarnrc.yml package.json yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --immutable

FROM base as dev 

WORKDIR /usr/src/app

# USER node

COPY --from=deps /tmp/.yarn ./.yarn
COPY --from=deps /tmp/node_modules ./node_modules

COPY . .

CMD yarn dev

FROM base as builder 

WORKDIR /usr/src/app

COPY --from=deps /tmp/node_modules ./node_modules

COPY . .

RUN yarn build

FROM nginx:${NGINX_TAG} as runner

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html