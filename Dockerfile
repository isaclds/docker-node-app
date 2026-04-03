FROM node:22-alpine

RUN apk --no-cache add curl

WORKDIR /api

COPY ./api/package*.json ./
RUN npm install

COPY ./api/server.js ./
COPY ./api/src/ ./src/

EXPOSE 3000

CMD ["node", "server.js"]