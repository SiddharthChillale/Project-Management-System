## To run scripts:
Below are a few commands to run in the terminal. 

1. `npm run test` : to run all the tests. This keeps watching for any changes. Doesn't stop until ctrl+c. Jest and supertest used to run the tests.
2. `npm run dev`: starts the server in development environment using nodemon at the url and port provided in a `.env` file in `src/`.
3. `npx prisma migrate`: generates a named migration SQL script in `src/schema/migrations`, and pushes schema changes to postgres db. good if you want to keep track of schema changes.
4. `npx prisma sd seed`: clears out the data from the database and fills with fake data. Current fake data is 5 project items.
5. `npx prisma push`: pushes schema changes to postgres db. This doesn't create a migration script. Good if schema change is small enough to not lose data.


## to Debug in vscode:

- Generate a `launch.json` file in vscode.
- Add configuration to attach to an npm script.
- Attach to npm script `npm run test-debug`.
- You can rename the "Launch via NPM" to anything you want.
- Go to "Run and Debug" in the VSCode sidebar > Select the "Launch via npm" > click the green triangle before it. This will run the mentioned script(which will create a process) and attach the vscode debugger to that process.
- Make sure to place breakpoints in the code before you start the debugger, or else it won't stop anywhere. 😛