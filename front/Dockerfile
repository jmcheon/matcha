# front
FROM node:18-slim As Base

WORKDIR /usr/app

ARG NODE_ENV

ENV NODE_ENV=$NODE_ENV

COPY package*.json ./

RUN if [ "$NODE_ENV" = "production" ]; then yarn global add yarn@latest && yarn install --production; else yarn global add yarn@latest && yarn install; fi

COPY . .

RUN if [ "$NODE_ENV" = "production" ]; then yarn build; fi

EXPOSE 3000

CMD if [ "$NODE_ENV" = "production" ]; then yarn start; else yarn dev; fi

