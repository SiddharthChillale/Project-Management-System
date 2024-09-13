import { createUsers } from "../../api/v1/controllers/user.controllers.js";
import { ProfileService } from "../../api/v1/services/user.services.js";
import { UserService } from "../../api/v1/services/user.services.js";
import { faker } from "@faker-js/faker";

async function testCreateProfile() {
    const id = 2;
    const email = "abc.xyz@gmail.com";
    const [response, error] = await ProfileService.create(email, id, "ADMIN");
    console.log(`error: ${error}`);
    console.log(`response: ${response}`);
}

function createUser(_email = undefined, _password = undefined) {
    const email = _email || faker.internet.email();
    const password = _password || faker.word.noun();
    return { email, password };
}

async function testBulkCreation() {
    const manyUserEmails = Array.from({ length: 10 }, () => createUser());
    const [response, error] = await UserService.createForToken(manyUserEmails);
    console.log(`error: ${error}`);
    console.log(`response: ${response}`);
}

async function testBulkCreationreq(role = undefined) {
    const manyUserEmails = Array.from({ length: 5 }, () => createUser());
    const req = { body: { dataArray: manyUserEmails, role: undefined } };
    const [response, error] = await createUsers(req, null, null);
    console.log(`error: ${error}`);
    console.log(`response: ${response}`);
}

async function main() {
    console.log("started");
    await testBulkCreationreq();
    console.log("ended");
}

main()
    .then(() => {
        console.log("\nUpdate complete");
    })
    .finally(async () => {
        // await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        // await prisma.$disconnect();
        process.exit(1);
    });
