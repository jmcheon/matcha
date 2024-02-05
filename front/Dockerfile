# front
FROM node:18

WORKDIR /usr/app

ARG NODE_ENV

ENV NODE_ENV=$NODE_ENV

COPY package*.json ./

RUN if [ "$NODE_ENV" = "production" ]; then npm install -g npm@latest && npm install --production; else npm install -g npm@latest && npm install; fi

COPY . .

RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

EXPOSE 3000

CMD if [ "$NODE_ENV" = "production" ]; then npm start; else npm run dev; fi
