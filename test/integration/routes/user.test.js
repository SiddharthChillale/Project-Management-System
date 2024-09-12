import app from "../../../src/app.js";
import request from "supertest";
import crypto from "node:crypto";
import UserService, {
    prisma
} from "../../../src/api/v1/services/user.services.js";

beforeAll(() => {});

afterAll(() => {});
describe("Protected routes", () => {
    describe("PUT /users/profile/", () => {
        const userObj = {
            email: "updateProfile.user@xyz.com",
            password: "root"
        };
        const newUserObj = {
            firstName: "updateProfile",
            lastName: "user",
            userName: "updProfile.user"
        };

        beforeEach(async () => {
            try {
                const hashedPassword = crypto
                    .scryptSync(userObj.password, "salt", 12)
                    .toString("base64");
                await UserService.register(userObj.email, hashedPassword);
            } catch (error) {
                console.log(`Update Profile delete user error: ${error}`);
            }
        });
        afterAll(async () => {
            try {
                await prisma.user.delete({
                    where: {
                        email: userObj.email
                    }
                });
            } catch (error) {
                console.log(`Update Profile delete user error: ${error}`);
            }
        });
        it("should fail when user attempting the update is not logged in", async () => {
            const response = await request(app)
                .patch("/api/v1/users/profile")
                .set("Accept", "application/json")
                .send({
                    newProfile: newUserObj
                });

            expect(response.statusCode).toBe(400);
        }, 10000);
        it("should pass with code 200 when update is reflected in the db", async () => {
            //Login User
            const loginResponse = await request(app)
                .post("/api/v1/users/login")
                .set("Accept", "application/json")
                .send(userObj);

            const cookies = loginResponse.headers["set-cookie"];

            const updateResponse = await request(app)
                .patch("/api/v1/users/profile")
                .set("Cookie", cookies)
                .set("Accept", "application/json")
                .send({
                    newProfile: newUserObj
                });

            expect(updateResponse.statusCode).toBe(200);
            expect(updateResponse.body.userName).toBe(newUserObj.userName);
            expect(updateResponse.body.firstName).toBe(newUserObj.firstName);
            expect(updateResponse.body.lastName).toBe(newUserObj.lastName);
        });
    });

    describe("POST /users/bulkUsers", () => {
        it.todo(
            "should throw error when req.body has an array of JSON objects but Each JSON object does not conform to User schema"
        );
        it.todo(
            "should throw error when req.body doesn't have either an array of JSON objects or a file."
        );
        it.todo("should throw error when file is not of format csv/ excel.");
        it.todo(
            "should throw error when csv/excel file doesn't have the expected headers"
        );
        it.todo(
            "should pass when the users passed in bulk are created and reflected in the db."
        );
        it.todo(
            "should fail the entire transaction when there is conflict with even one user."
        );
    });
});

describe("Login /login", () => {
    const userObj = {
        email: "login.user@xyz.com",
        password: "root"
    };
    beforeAll(async () => {
        const hashedPassword = crypto
            .scryptSync(userObj.password, "salt", 12)
            .toString("base64");
        await UserService.register(userObj.email, hashedPassword);
    });
    afterAll(async () => {
        await prisma.user.delete({
            where: {
                email: userObj.email
            }
        });
    });
    it("should error when req.body doesn't have the mandatory fields(email|username, password) for login.", async () => {
        const response = await request(app)
            .post("/api/v1/users/login")
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(400);
    });
    it("should throw error when user hasn't registered in the system.", async () => {
        const response = await request(app)
            .post("/api/v1/users/login")
            .set("Accept", "application/json")
            .send({
                email: "unregisted@unregisted.com",
                password: "root"
            });

        expect(response.statusCode).toBe(404);
    });
    it("should pass when response has accessToken and refreshToken in the response cookie after a successful login {with email}", async () => {
        const response = await request(app)
            .post("/api/v1/users/login")
            .set("Accept", "application/json")
            .send(userObj);

        expect(response.statusCode).toBe(200);
        // expect(response.cookies).toBeDefined();
        expect(response.headers["set-cookie"]).toBeDefined(); // Ensure cookies are set

        // Check for individual cookies
        const cookies = response.headers["set-cookie"].map(
            (cookie) => cookie.split("=")[0]
        );

        expect(cookies).toContain("accessToken");
        expect(cookies).toContain("refreshToken");

        await UserService.updateOneById(response.body.user.id, {
            refreshToken: null
        });
    });

    it("should pass when response has accessToken and refreshToken in the response cookie after a successful login {with username}", async () => {
        const response = await request(app)
            .post("/api/v1/users/login")
            .set("Accept", "application/json")
            .send({
                userName: "login.user",
                password: "root"
            });

        expect(response.statusCode).toBe(200);
        expect(response.headers["set-cookie"]).toBeDefined(); // Ensure cookies are set

        // Check for individual cookies
        const cookies = response.headers["set-cookie"].map(
            (cookie) => cookie.split("=")[0]
        );

        expect(cookies).toContain("accessToken");
        expect(cookies).toContain("refreshToken");
        await UserService.updateOneById(response.body.user.id, {
            refreshToken: null
        });
    });
    it("should throw code 409: Conflict when a logged-in user attempts to login again.", async () => {
        const response1 = await request(app)
            .post("/api/v1/users/login")
            .set("Accept", "application/json")
            .send(userObj);

        expect(response1.statusCode).toBe(200);

        const response2 = await request(app)
            .post("/api/v1/users/login")
            .set("Accept", "application/json")
            .send(userObj);
        expect(response2.statusCode).toBe(409);

        await UserService.updateOneById(response1.body.user.id, {
            refreshToken: null
        });
    }, 20000);
});
describe("Logout /logout", () => {
    const userObj = {
        email: "logout.user@xyz.com",
        password: "root"
    };
    let cookies;
    // let gRToken;
    // let gAToken;
    beforeAll(async () => {
        const hashedPassword = crypto
            .scryptSync(userObj.password, "salt", 12)
            .toString("base64");
        await UserService.register(userObj.email, hashedPassword);
        const response = await request(app)
            .post("/api/v1/users/login")
            .set("Accept", "application/json")
            .send(userObj);

        // expect(response.headers["set-cookie"]).toBeDefined(); // Ensure cookies are set

        // Check for individual cookies
        cookies = response.headers["set-cookie"];
        // const allCookies = response.headers["set-cookie"].map(
        //     (cookie) => cookie.split("=")[1]
        // );
        // gAToken = allCookies[0].split(";")[0];
        // gRToken = allCookies[1].split(";")[0];
    });
    afterAll(async () => {
        cookies = undefined;
        try {
            await prisma.user.delete({
                where: {
                    email: userObj.email
                }
            });
        } catch (err) {
            console.log(`LOGOUT: attempted to delete non-existent user ${err}`);
        }
    });
    it.todo(
        "should throw error when user attempts any protected route after logging out. Even after using the accessToken it had before."
    );
    it("should pass when response has a cleared out cookie field.", async () => {
        const reqCookies = cookies;
        const agent = request.agent(app);
        const response = await agent
            .post("/api/v1/users/logout")
            // .set("Authorization", `Bearer ${gAToken}`)
            .set("Cookie", reqCookies)
            .set("Accept", "application/json")
            .send({});

        expect(response.statusCode).toBe(200);
        const abc = response.headers["set-cookie"][0].split(";")[0].split("=");
        const def = response.headers["set-cookie"][1].split(";")[0].split("=");
        expect(abc[1]).toBe("");
        expect(def[1]).toBe("");
        // expect(abc).not.toBeDefined(); // Ensure cookies are set
    }, 200000);
});

describe("Register /register", () => {
    it("should throw error when req.body doesn't have the mandatory fields(email, password) for register.", async () => {
        const response = await request(app)
            .post("/api/v1/users/register")
            .set("Accept", "application/json")
            .send({
                email: "register.user@example.com"
            });

        expect(response.statusCode).toBe(400);
    });
    it("should throw error when user unique fields create conflict with the db. (Email alrady exists)", async () => {
        const response1 = await request(app)
            .post("/api/v1/users/register")
            .set("Accept", "application/json")
            .send({
                email: "register.user@example.com",
                password: "abcd"
            });

        const response2 = await request(app)
            .post("/api/v1/users/register")
            .set("Accept", "application/json")
            .send({
                email: "register.user@example.com",
                password: "abcd"
            });

        expect(response2.statusCode).toBe(400);
        try {
            await prisma.user.delete({
                where: { email: "register.user@example.com" }
            });
        } catch (err) {
            console.log(`attempted to delete non-existent user ${err}`);
        }
    }, 10000);
    it("should pass when reponse body has a username field after a successful register. Username is generated in backend.", async () => {
        const response = await request(app)
            .post("/api/v1/users/register")
            .set("Accept", "application/json")
            .send({
                email: "register.user@example.com",
                password: "abcd"
            });
        try {
            await prisma.user.delete({
                where: { email: "register.user@example.com" }
            });
        } catch (err) {
            console.log(`attempted to delete non-existent user ${err}`);
        }
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("id", expect.any(String));
        expect(response.body).toHaveProperty("userName", expect.any(String));
    }, 10000);
});

describe("Unprotected routes", () => {
    describe("GET /users", () => {
        it.todo(
            "should pass when called with response body being an array of JSON Objects of schema User"
        );
        it.todo(
            "should throw error when even one of the response object has any of the restricted fields([password|refreshToken|..other tokens])"
        );
    });

    describe("GET /users/:id/profile", () => {
        it.todo("should fail when called without an id parameter in req");
        it.todo(
            "should pass when return response has a JSON object of schema User"
        );
        it.todo(
            "should throw error when the response object has any of the restricted fields([password|refreshToken|..other tokens])"
        );
    });
});
