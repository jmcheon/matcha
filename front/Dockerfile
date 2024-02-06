# back
FROM node:18-slim As Base

WORKDIR /app

ARG NODE_ENV

ENV NODE_ENV=$NODE_ENV

COPY package*.json ./

RUN if [ "$NODE_ENV" = "production" ]; then yarn global add yarn@latest && yarn install --production; else yarn global add yarn@latest && yarn install && yarn add --dev @types/express && yarn global add nodemon ts-node typescript; fi

COPY . .

CMD if [ "$NODE_ENV" = "production" ]; then yarn build && yarn start; else yarn run start:dev; fi

