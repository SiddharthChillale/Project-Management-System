1. Since I'm using node version ^20, I do not need the dotenv package to read env files.
2. I'm using ES6 module, instead of CommonJS: to use `imports` rather than `requires`. To do this, define type: "module" in package.json.
3. __dirname variable is CommonJS, and not ES6.
4. Use `export function abc()` or `eport default abc` to export in node js in ES6.


A. organically separated app, routes, controllers, models. Models is just a js array of JSON objects. Used ChatGPT to fill  array with dummy data.
B. Used helmet js to automatically add security headers. Still pending to test for CORS.
C. Used express json method to facilitate json receiving in req.body.
D. Used path lib to state a rootDir from where I can navigate to other directories.
