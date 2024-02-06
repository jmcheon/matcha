# back
FROM node:18

WORKDIR /app

ARG NODE_ENV

ENV NODE_ENV=$NODE_ENV

COPY package*.json ./

RUN if [ "$NODE_ENV" = "production" ]; then npm install -g npm@latest && npm install --production; else npm install -g npm@latest && npm install && npm install -g nodemon; fi

COPY . .

CMD if [ "$NODE_ENV" = "production" ]; then npm start; else npm run start:dev; fi
