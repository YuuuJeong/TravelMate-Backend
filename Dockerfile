FROM node:18-alpine

EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY /dist ./dist

RUN npm install

ENTRYPOINT npm run start:prod