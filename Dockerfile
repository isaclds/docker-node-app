FROM node:22-alpine

RUN apk --no-cache add curl

WORKDIR /app

COPY ./app/package*.json ./
RUN npm install

COPY ./app/server.js ./
COPY ./app/src/ ./src/

EXPOSE 3000

CMD ["node", "server.js"]