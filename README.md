# NestJS Starwars-api

## Prerequisites

[Node.js](https://nodejs.org/es/) (v14+ recommended)
npm or yarn

## .env vars 🔧

You have a .env.dev with all the variables. You can modify if you need

## Installation 🔧

Clone the repo

```
git clone https://github.com/lucasgalarce/backend-nest
```

Install NPM packages

```
npm install
npm run start:dev
```

In the postman folder you have a file to import into the Postman app

## Usage

- First use: An admin will be created.
- How to authenticate:

curl http://localhost:3000/api/auth/login
body:
{
"username": "admin",
"password": "Admin2121!"
}

## Documentation

Swagger is running on: http://localhost:3000/api/docs

## Deploy
