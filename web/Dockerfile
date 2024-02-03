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

COPY --chown=node:node --from=deps /tmp/.yarn ./.yarn
COPY --chown=node:node --from=deps /tmp/node_modules ./node_modules

COPY --chown=node:node . .

RUN chmod 777 /usr/src/app

USER node

CMD yarn dev

FROM base as builder 

WORKDIR /usr/src/app

COPY --from=deps /tmp/node_modules ./node_modules

COPY . .

RUN yarn build

FROM nginx:${NGINX_TAG} as runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html