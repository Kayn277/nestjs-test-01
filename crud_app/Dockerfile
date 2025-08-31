FROM node:22-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps


FROM base AS build

COPY . .

RUN npm run build


FROM node:22-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install  --legacy-peer-deps

COPY --from=build /usr/src/app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

CMD npx typeorm migration:run -d ./dist/utils/database.config.js && node dist/main.js
