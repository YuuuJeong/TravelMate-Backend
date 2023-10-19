FROM node:20-alpine as builder

WORKDIR /app
COPY ./package*.json ./
COPY ./tsconfig*.json ./
COPY src ./src
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

RUN npm ci && npm run build

FROM node:20-slim
RUN apt-get update
RUN apt-get install -y openssl
WORKDIR /app
COPY ./package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist


ENV PATH /app/node_modules/.bin:$PATH

EXPOSE 8080
ENTRYPOINT ["npm", "run", "start:prod"]
