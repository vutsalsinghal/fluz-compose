FROM node:10-alpine AS build

RUN apk update && \
    apk upgrade && \
    apk --update add \
    gcc \
    bash \
    git \
    rm -rf /var/cache/apk/*

WORKDIR /mnt

ADD package.json .
ADD db ./db
ADD schema ./schema
RUN npm install

FROM node:10-alpine
ENV ASH_PATH="/etc/profile"

RUN apk update && apk upgrade && apk --update add bash nano
RUN npm i -g knex
WORKDIR /home

ADD index.js .
ADD package.json .
ADD knexfile.js .
ADD db ./db
ADD schema ./schema
COPY --from=build /mnt/node_modules ./node_modules
ADD .ashrc .

RUN cat .ashrc >> "$ASH_PATH"
CMD ["npm","start"]