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

### Creating a New Movie

To create a new movie, you must be logged in as an admin. Use the POST **/films** endpoint, where you will send an object with "id" between 1 and 6. This ID corresponds to the movie number. Information about the movie is fetched using the public Star Wars API and then stored in our database.

### Edit Movie

To update a movie, use the PUT **/films/:filmId** endpoint. You should send an object containing the valid properties of the movie that you want to edit.

### Creation of All Movies

I took the liberty of adding this endpoint, which adds all 6 movies provided by the Star Wars API to our database.
Endpoint POST **/films/all**

## Documentation

Swagger is running on: http://localhost:3000/api/docs

## Deploy

Deploy is running on: https://backend-nest-production-f3dd.up.railway.app/api/

Swagger: https://backend-nest-production-f3dd.up.railway.app/api/docs
