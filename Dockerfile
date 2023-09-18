FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json .
COPY tsconfig*.json .
COPY src ./src
RUN npm ci && npm run build

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 8080
ENTRYPOINT ["npm", "run", "start:prod"]
