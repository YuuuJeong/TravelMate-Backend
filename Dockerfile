FROM node:20-alpine

WORKDIR /app
COPY ./package*.json ./
COPY ./tsconfig*.json ./
COPY prisma ./prisma/
RUN npm ci && npx prisma generate

COPY src ./src
RUN  npm run build

FROM node:20-alpine
WORKDIR /app
COPY ./package*.json ./
COPY --from=0 /app/node_modules ./node_modules
COPY --from=0 /app/dist ./dist
COPY --from=0 /app/prisma ./prisma

ENV PATH /app/node_modules/.bin:$PATH

EXPOSE 8080
ENTRYPOINT ["npm", "run", "start:prod"]
