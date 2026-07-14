FROM node:22.22.3-alpine

RUN apk --no-cache add curl
RUN mkdir /logs

WORKDIR /api

COPY ./api/package*.json ./
RUN npm install --omit=dev

COPY ./api/*.js ./
COPY ./api/src/ ./src/

USER node

EXPOSE 3000

CMD ["npm", "start"]