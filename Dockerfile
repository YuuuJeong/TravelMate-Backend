FROM node:18-alpine

EXPOSE 8080
WORKDIR /app

COPY  /app/dist .

ENTRYPOINT ["npm", "run", "start:prod"]
