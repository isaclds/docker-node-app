# docker-node-app

Repository to study docker

# To run

`sudo docker compose down -v && sudo docker compose up --build` or `docker compose down -v && docker compose up --build`

Curls to test

Get all posts

```bash
postman request 'localhost:8080/app/posts/' \
  --header 'x-api-key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30'
```

Create Post

```bash
postman request POST 'localhost:8080/app/posts/' \
  --header 'x-api-key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30' \
  --header 'Content-Type: application/json' \
  --body '{
	"email": "bob@email.com", "title": "Motivate you today", "content": "This post will motivate you"
}'
```
