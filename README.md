# Blog API
This is a simple blog API using ExpressJS, Prisma, and MongoDB

## Table Of Content
- [Pre-requisite](#pre-requisite)
- [How To Install](#how-to-install)
- [Project Structure](#project-structure)

## Pre-requisite
- [NodeJS](https://nodejs.org)
- [MongoDB](https://www.mongodb.com/)

## How to install
To run the application make sure pre-requisite above are installed on your machine, here are step to run the application.
1. Clone application from this repository using blow command
```
git clone git@github.com:fiqrikm18/MSKL-Blog_API.git
```
2. Copy or rename `.env.example` file to `.env`
3. Change configurations inside file `.env`, adjust to the settings on your local machine, for example
```
DATABASE_URL=mongodb://127.0.0.1:27017/db?authSource=admin
PORT=3000

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

if you want running on the application using docker you can replace host on database section to container name where database used, in this configuration you can use

```
DATABASE_URL=mongodb://mongodb:27017/db?authSource=admin
PORT=3000

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

```

`mongodb` are service name on `docker-compose.yml` file

4. Run `npm install` to install dependency application used for
5. Run `npm run prisma:generate` to generate prisma client
6. Run `npm run build` to build express application
7. Run `npm run start` to run application
8. Or if you want run using docker you can run command `docker compose up -d --build`
9. Application now can access through `http://localhost:3000/api/v1/*`

## Project Structure
```
├── prisma/
│   ├── migrations/
│   ├── models/
│   │   ├── article.prisma
│   │   ├── pageview.prisma
│   │   ├── user.prisma
│   │   └── usertoken.prisma
│   └── schema.prisma
├── scripts/
│   ├── mongodb/
├── src/
│   ├── domain/
│   │   ├── article/
│   │   │   ├── controller/
│   │   │   │   ├── article.controller.ts
│   │   │   │   └── page_view.controller.ts
│   │   │   ├── dto/
│   │   │   │   ├── article.dto.ts
│   │   │   │   └── page_view.dto.ts
│   │   │   ├── exception/
│   │   │   │   └── ArticleNotFoundException.ts
│   │   │   ├── repository/
│   │   │   │   ├── article.repository.ts
│   │   │   │   └── page_view.repository.ts
│   │   │   ├── service/
│   │   │   │   ├── article.service.ts
│   │   │   │   └── page_view.service.ts
│   │   │   └── container.ts
│   │   ├── health_check/
│   │   │   ├── controller/
│   │   │   │   └── health_check.controller.ts
│   │   │   └── container.ts
│   │   ├── shared/
│   │   │   ├── dto/
│   │   │       └── pagination.dto.ts
│   │   ├── user/
│   │       ├── controller/
│   │       │   ├── authentication.controller.ts
│   │       │   └── user.controller.ts
│   │       ├── dto/
│   │       │   ├── authentication.dto.ts
│   │       │   └── user.dto.ts
│   │       ├── exception/
│   │       │   ├── AuthenticatioException.ts
│   │       │   └── UserException.ts
│   │       ├── repository/
│   │       │   ├── user.repository.ts
│   │       │   └── user_token.repository.ts
│   │       ├── service/
│   │       │   ├── authentication.service.ts
│   │       │   └── user.service.ts
│   │       └── container.ts
│   ├── infrastructures/
│   │   ├── database/
│   │       └── prisma.ts
│   ├── middlewares/
│   │   ├── authentication.middleware.ts
│   │   └── error.middleware.ts
│   ├── utils/
│   │   ├── http/
│   │   │   └── responser.ts
│   │   ├── async_handler.ts
│   │   └── binding.ts
│   ├── app.ts
│   └── server.ts
├── Dockerfile
├── README.md
├── docker-compose.yml
├── eslint.config.js
├── init-replica.sh
├── package-lock.json
├── package.json
├── prisma.config.js
├── prisma.config.js.map
├── prisma.config.ts
├── tsconfig.json
└── yarn.lock
```
