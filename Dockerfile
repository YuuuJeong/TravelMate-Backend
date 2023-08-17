FROM node:18-alpine

EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

WORKDIR /app

ADD . /app/


RUN npm install
RUN npm run build
ENTRYPOINT npm run start:prod