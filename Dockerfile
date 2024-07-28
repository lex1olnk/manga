FROM node:18-buster

RUN npm i -g pm2

USER node
WORKDIR /srv

CMD node .output/server/index.mjs
