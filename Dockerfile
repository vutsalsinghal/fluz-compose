# Developement dockerfile

FROM node:10-alpine

ENV ENV="/etc/profile"

RUN apk update && \
    apk upgrade && \
    apk --update add \
    gcc \
    tree \
    rm -rf /var/cache/apk/*

RUN npm i -g knex

WORKDIR /home
ADD .ashrc .

RUN cat .ashrc >> "$ENV"

CMD ["npm", "start"]