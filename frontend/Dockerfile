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
ADD public ./public
ADD src ./src
RUN npm install

FROM node:10-alpine
ENV ENV="/etc/profile"

RUN apk update && apk upgrade && apk --update add bash nano
WORKDIR /home

COPY --from=build /mnt/package.json .
COPY --from=build /mnt/public ./public
COPY --from=build /mnt/node_modules ./node_modules
COPY --from=build /mnt/src/ ./src
ADD .ashrc .

RUN cat .ashrc >> "$ENV"
CMD ["npm","start"]