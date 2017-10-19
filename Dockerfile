FROM node:latest

RUN DEBIAN_FRONTEND=noninteractive \
    npm install -g yarn && \
    mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN yarn install && \
    yarn clean && \
    yarn build

ENV PORT=80
EXPOSE 80

ENTRYPOINT [ "/usr/local/bin/yarn", "start:prod" ]
