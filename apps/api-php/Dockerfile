FROM php:8.2-cli-alpine

WORKDIR /app

RUN apk add --no-cache sqlite-dev pdo_sqlite

COPY composer.json .
COPY src/ ./src/
COPY public/ ./public/

EXPOSE 8001

CMD ["php", "-S", "0.0.0.0:8001", "-t", "public"]
