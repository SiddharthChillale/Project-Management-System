1. Since I'm using node version ^20, I do not need the dotenv package to read env files.
2. I'm using ES6 module, instead of CommonJS: to use `imports` rather than `requires`. To do this, define type: "module" in package.json.
3. \_\_dirname variable is CommonJS, and not ES6.
4. Use `export function abc()` or `eport default abc` to export in node js in ES6.

A. organically separated app, routes, controllers, models. Models is just a js array of JSON objects. Used ChatGPT to fill array with dummy data.
B. Used helmet js to automatically add security headers. Still pending to test for CORS.
C. Used express json method to facilitate json receiving in req.body.
D. Used path lib to state a rootDir from where I can navigate to other directories.

JEST:

1. `describe()` sets the scope for and groups all tests inside it.
2. `it()` or `test()`, runs a particular test inside it.
3. `request(app).method(URL)` is from SUPERTEST lib, this creates an http server with the `app` server object provided in it. The `app` object is the same you get from `app.js`. the request(app).method calls an http method on `app`. e.g. `request(app).get(URL)` calls the `GET` method on the `URL` using the `app` server.
4. it.todo() can create a test that shows as "todo" when tests are run. This is useful when you want placeholder tests that need to be filled in later, but you wouldn't want to miss/skip in development later.
5. Run tests via command `jest --watchAll --verbose`. watchAll makes jest run continually like nodemon. verbose is self-explanantory. can also run as `npx jest [options]`
6. To have JEST run with ESM, needed to install babel and write config in `.babelrc` and `jsconfig.json`.
