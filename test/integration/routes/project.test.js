import request from "supertest";

import app from "../../../src/app.js";
import mock from "../../mock_data/project.mock.js";

const projectObject = {
    name: expect.any(String),
    description: expect.any(String),
    teamSize: expect.any(Number),
    privateAttachments: expect.any(Object),
    publicAttachments: expect.any(Object)
};

// const upd_project = mock.upd;
// const new_project = mock.new;
// const all_project = mock.all;
beforeAll(() => {
    // seed db
    //
});

afterAll(() => {});

describe("GET /projects", () => {
    it("should pass with response code 200 when response body array is an array of projectObjects", async () => {
        await request(app)
            .get("/api/v1/projects")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);
    });
});

describe("GET /projects/:id", () => {
    it.skip("should pass with response code 200 when response body JSON object matches projectObject", async () => {
        const legit_prj_id = 2; // TODO: legit project id
        await request(app)
            .get(`/projects/${legit_prj_id}`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toMatchObject(projectObject);
            });
    });

    it("should throw error 404 when requested project is not found", async () => {
        const bogus_prj_id = 999;
        await request(app)
            .get(`/projects/${bogus_prj_id}`)
            .set("Accept", "application/json")
            .expect(404);
    });
});

describe("POST /projects", () => {
    it("should throw error when request body doesn't have a project", async () => {
        const response = await request(app)
            .post("/api/v1/projects")
            .set("Accept", "application/json")
            .send({ random_request_body: "bogus" });

        expect(response.statusCode).toBe(400);
        // expect(response).toMatch("No project body provided");
    });

    it("should throw error when request body has project but it is not an object", async () => {
        const response = await request(app)
            .post("/api/v1/projects")
            .set("Accept", "application/json")
            .send({ project: "bogus" });

        expect(response.statusCode).toBe(400);

        // expect(response).toMatch("No project body provided");
    });

    it.todo("should throw error when insertion is not reflected in the db");
    it("Should pass with code 200 when response body has project Id of inserted project.", async () => {
        const response = await request(app)
            .post("/api/v1/projects")
            .set("Accept", "application/json")
            .send({ project: mock.new })
            .expect("Content-Type", /json/)
            .expect(200);
        expect(response.body).toHaveProperty("id", expect.any(Number));
    });
});

describe("PUT /projects/:id", () => {
    it("should throw error when request body is missing project object to update with", async () => {
        const prj_id = 2;
        await request(app)
            .put(`/api/v1/projects/${prj_id}`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400);
    });

    it("should throw error when requested project is not present in db", async () => {
        const bogus_prj_id = 999;
        await request(app)
            .put(`/api/v1/projects/${bogus_prj_id}`)
            .set("Accept", "application/json")
            .send({ project: mock.upd })
            .expect(404);
    });
    it.todo(
        "should throw error when updated project is not reflected in the db"
    );
    // it.skip("should return with code 200 when update is successful.", async () => {
    //     const legit_prj_id = "000abc"; // TODO: find legit id
    //     const response = await request(app)
    //         .put(`/projects/${legit_prj_id}`)
    //         .set("Accept", "application/json")
    //         .send({ project: mock.upd });

    //     expect(response.statusCode).toBe(200);
    //     expect(response).toMatchObject({ id: expect.any(String) });
    //     // expect(response).toMatchSnapshot(mock.upd);
    // });
});

describe("DELETE /projects/:id", () => {
    it("should throw error when requested project is not found", async () => {
        const bogus_prj_id = 999;
        await request(app)
            .delete(`/api/v1/projects/${bogus_prj_id}`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(404);
    });
    it.todo(
        "should throw error when deleted project is able to be retrieved after deletion."
    );

    it.skip("should pass with response code 200 when deleted project is reflected in the db.", async () => {
        const legit_prj_id = 2; // TODO: figure  out how to get legit prj id
        await request(app)
            .delete(`/api/v1/projects/${legit_prj_id}`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);
    });
});
