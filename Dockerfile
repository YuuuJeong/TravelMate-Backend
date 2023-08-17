FROM node:18-alpine

EXPOSE 8080

WORKDIR /app

ADD . /app/


RUN npm install

RUN npm run build

ENTRYPOINT npm run start:prod