FROM node:24-alpine

WORKDIR /app

COPY app/src/package*.json ./

RUN npm i

COPY app/src/ ./

EXPOSE 3000

CMD ["node", "server.js"]

