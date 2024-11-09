## Notes

1. Since I'm using node version ^20, I do not need the dotenv package to read env files.
2. I'm using ES6 module, instead of CommonJS: to use `imports` rather than `requires`. To do this, define type: "module" in package.json.
3. \_\_dirname variable is CommonJS, and not ES6.
4. Use `export function abc()` or `eport default abc` to export in node js in ES6.

## Log

-   organically separated app, routes, controllers, models. Models is just a js array of JSON objects. Used ChatGPT to fill array with dummy data.
-   Used helmet js to automatically add security headers. Still pending to test for CORS.
-   Used express json method to facilitate json receiving in req.body.
-   Used path lib to state a rootDir from where I can navigate to other directories.

## JEST & Supertest

1. `describe()` sets the scope for and groups all tests inside it.
2. `it()` or `test()`, runs a particular test inside it.
3. `request(app).method(URL)` is from SUPERTEST lib, this creates an http server with the `app` server object provided in it. The `app` object is the same you get from `app.js`. the request(app).method calls an http method on `app`. e.g. `request(app).get(URL)` calls the `GET` method on the `URL` using the `app` server.
4. `it.todo()` can create a test that shows as "todo" when tests are run. This is useful when you want placeholder tests that need to be filled in later, but you wouldn't want to miss/skip in development later.
5. Run tests via command `jest --watchAll --verbose`. watchAll makes jest run continually like nodemon. verbose is self-explanantory. can also run as `npx jest [options]`
6. To have JEST run with ESM, needed to install babel and write config in `.babelrc` and `jsconfig.json`.

## PRISMA

1. `prisma generate`
    - Generates prisma client.
    - Can generate to multiple generators like prisma client, zod schemas, etc.
2. `prisma db pull`
    - Connects to database.
    - Pulls dtabase models to prisma schema.
3. `prisma push`
    - Pushes the schema from client to db without using migrations.
    - Good to use for local development and small changes; if you don't want to version your schema changes.
4. `prisma migrate [dev|deploy|reset|resolve|status|diff]`
    - `dev` and `deploy` for dev and non-dev environments.
    - generates the migrations and applies to db.
5. By default schema is placed in `prisma/schema.prisma` alongwith `prisma/migrations/`. Can change this path by specifying the intended path in the `package.json` file.
   e.g.

```
"prisma":{
    "schema": "./src/schema/schema.prisma",
    "seed":"node ./src/schema/scripts/seed.js"
  },
```

6. Dev Process: _explains why prisma is a dev dependency while prisma client is a prod dependency_
    1. Write schemas in `schema.prisma`
    2. do `prisma db push` or `prisma db migrate dev` to set schema changes to db and generate prisma client.
    3. Prisma client is generated in `node_modules/.prisma/client`.
    4. import/invoke this Prisma Client in source code to deal with database management and db calls.
    5. When running on fresh system, node_modules prisma client is recreated according to the `schema.prisma` file, the location of which is in `package.json`
7. All model handling functions are written in `src/services/` directory. These functions handle database actions, like CRUD operations on a REST API.

################ DEPLOYING to RPI

1. create .env.production file in root directory.
2. create .docker/postgres/.env file.
3. run `docker compose -f compose.yml -f compose.prod.yml up --build`
4. run `docker exec -it pms_server /bin/bash`
5. run `npx prisma generate`
6. run `npx prisma migrate deploy`
7. run `npm run build-fake-db`
