# NestJS CRUD App with Docker Compose

This is a NestJS application using PostgreSQL and Redis. It supports caching, JWT authentication.

---

## Prerequisites

- Docker installed
- npm

---

## Environment Variables

All environment variables are set in the `docker-compose.yml`:

```env
REDIS_URL=redis://redis:6379
JWT_SECRET=secret
NODE_ENV=development
DATABASE_HOST=db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgrespass
DATABASE_PORT=5432
DATABASE_NAME=mydb
```

---

## Quick start

```
git clone https://github.com/Kayn277/nestjs-test-01.git
docker-compose up -d
```

## Testing

```
cd crud_app && jest
```

## POSTMAN

There is postman collection provided for quick start testing routes

## Swagger

```
api/docs route
```
