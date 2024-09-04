import app from "../app.js";
import request from "supertest";
import mock from "./mock/project.js";

const projectObject = {
    name: expect.any(String),
    description: expect.any(String),
    teamSize: expect.any(Number),
    privateAttachments: expect.any(Object),
    publicAttachments: expect.any(Object)
};

const bogus_prj_id = "000abc";
const legit_prj_id = "still figuring out";
const bogus_prj_name = "";
const upd_project = mock.upd;
const new_project = mock.new;
const all_project = mock.all;

describe("GET /projects", () => {
    it("should pass with response code 200 if response body is JSON object", async () => {
        await request(app)
            .get("/projects")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);
    });

    it("should pass with response code 200 if response body matches projectObject when req.query.Id is given", async () => {
        await request(app)
            .get("/projects")
            .query({ id: legit_prj_id })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toMatchObject(projectObject);
            });
    });

    it("should throw error 404 if requested project is not found when req.query.Id is given", async () => {
        await request(app)
            .get("/projects")
            .query({ id: bogus_prj_id })
            .set("Accept", "application/json")
            .expect(404);
    });

    it.todo("should throw error if db connection is unsuccessful");
});

describe("POST /projects", () => {
    it("should throw error if request body doesn't have projectObject", async () => {
        await request(app)
            .post("/projects")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400, (response) => {
                expect(response).toMatch("No project body provided");
            });
    });

    it.todo("should throw error if db connection is not successful");
    it.todo("should throw error if insertion is not successful");
    it("Should pass if response body has (code 200 and project Id of inserted project).", async () => {
        await request(app)
            .post("/projects")
            .use(new_project)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, (response) => {
                expect(response).toMatchObject({ id: expect.any(Number) });
            });
    });
});

describe("PUT /projects", () => {
    // expected_update_request = {
    //     id: expect.any(Number),
    //     project: mock.upd
    // };

    describe("Request body has insufficient data", () => {
        it("should throw error if request body is missing id of project to update", async () => {
            await request(app)
                .put("/projects")
                .use({ project: upd_project })
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(400, (response) => {
                    expect(response).toMatch("No Project Id given");
                });
        });

        it("should throw error if request body is missing project object to update with", async () => {
            await request(app)
                .put("/projects")
                .use({ id: bogus_prj_id })
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(400);
        });

        it("should throw error if request body is missing both id of project to update and project data", async () => {
            await request(app)
                .put("/projects")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(400);
        });
    });

    it.todo("should throw error if db connection is not successful");
    it("should throw error if requested project is not present in db", async () => {
        await request(app)
            .put("/projects")
            .set("Accept", "application/json")
            .use({ id: bogus_prj_id, project: upd_project })
            .expect(404);
    });
    it.todo("should throw error if updation is not successful");
    it.skip("should return with code 200 on successful updation.", async () => {
        await request(app)
            .put("/projects")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .use({ id: legit_prj_id, project: upd_project })
            .expect(200, (response) => {
                expect(response).toMatchObject({ id: expect.any(Number) });
            });
    });
});

describe("DELETE /projects", () => {
    it("should throw error if req body doesn't have a project id to delete", async () => {
        await request(app)
            .delete("/projects")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400, (response) => {
                expect(response).toMatch("No Project Id given");
            });
    });
    it.todo("should throw error if db connection is not successful");
    it("should throw error if requested project is not found", async () => {
        await request(app)
            .delete("/projects")
            .query({ id: bogus_prj_id })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(404);
    });
    it.todo("should throw error if deletion is not succesfull");

    it("should pass if response code is 200 on successful deletion.", async () => {
        await request(app)
            .delete("/projects")
            .query({ id: legit_prj_id })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);
    });
});
