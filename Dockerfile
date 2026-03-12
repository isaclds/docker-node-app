FROM node:22-alpine

WORKDIR /app

COPY ./app/package*.json ./
RUN npm install

COPY ./app/server.js ./
COPY ./app/src/ ./src/

EXPOSE 3000

CMD ["node", "server.js"]