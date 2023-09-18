FROM node:18-alpine

EXPOSE 8080
WORKDIR /app

COPY ./dist .

ENTRYPOINT ["npm", "run", "start:prod"]
