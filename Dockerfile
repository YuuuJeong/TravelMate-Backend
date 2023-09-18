FROM node:18-alpine

EXPOSE 8080
WORKDIR /app
COPY . .
RUN npm install && \
  npm run build

ENTRYPOINT ["npm", "run", "start:prod"]
