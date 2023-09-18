FROM node:18-alpine

EXPOSE 8080
WORKDIR /app

RUN ls -al

COPY . .

ENTRYPOINT ["npm", "run", "start:prod"]
