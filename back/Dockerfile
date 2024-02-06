# back
FROM node:18-slim As Base

WORKDIR /app

ARG NODE_ENV

ENV NODE_ENV=$NODE_ENV

COPY package*.json ./

RUN if [ "$NODE_ENV" = "production" ]; then yarn global add yarn@latest && yarn install --production; else yarn global add yarn@latest && yarn install && yarn global add nodemon; fi

COPY . .

CMD if [ "$NODE_ENV" = "production" ]; then yarn start; else yarn run start:dev; fi

