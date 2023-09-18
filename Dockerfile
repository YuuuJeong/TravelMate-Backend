FROM node:20-alpine as builder

WORKDIR /app
COPY ./package*.json ./
COPY ./tsconfig*.json ./
COPY src ./src

RUN ls -al
RUN npm ci && npm run build

FROM node:20-slim
WORKDIR /app
COPY ./package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 8080
ENTRYPOINT ["npm", "run", "start:prod"]
