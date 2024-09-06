import request from "supertest";

import app from "../../../src/app.js";
import mock from "../../mock_data/project.js";

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
            .get("/projects")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);
    });

    it.todo("should throw error when db connection is unsuccessful");
});

describe("GET /projects/:id", () => {
    it.skip("should pass with response code 200 when response body JSON object matches projectObject", async () => {
        const legit_prj_id = "000abc"; // TODO: legit project id
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
        const bogus_prj_id = "000abc";
        await request(app)
            .get(`/projects/${bogus_prj_id}`)
            .set("Accept", "application/json")
            .expect(404);
    });
    it.todo("should throw error when db connection is unsuccessful");
});

describe("POST /projects", () => {
    it("should throw error when request body doesn't have a projectObject", async () => {
        const response = await request(app)
            .post("/projects")
            .set("Accept", "application/json")
            .send({ random_request_body: "bogus" })
            .expect(400);

        // expect(response).toMatch("No project body provided");
    });

    it.todo("should throw error when db connection is not successful");
    it.todo("should throw error when insertion is not successful");
    it("Should pass with code 200 when response body has project Id of inserted project.", async () => {
        const response = await request(app)
            .post("/projects")
            .set("Accept", "application/json")
            .send({ project: mock.new })
            .expect("Content-Type", /json/)
            .expect(200);
        expect(response.body).toHaveProperty("id", expect.any(String));
    });
});

describe("PUT /projects/:id", () => {
    it("should throw error when request body is missing project object to update with", async () => {
        const legit_prj_id = "000abc";
        await request(app)
            .put(`/projects/${legit_prj_id}`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400);
    });

    it.todo("should throw error when db connection is not successful");
    it("should throw error when requested project is not present in db", async () => {
        const bogus_prj_id = "000abc";
        await request(app)
            .put(`/projects/${bogus_prj_id}`)
            .set("Accept", "application/json")
            .send({ project: mock.upd })
            .expect(404);
    });
    it.todo("should throw error when updation is not successful");
    it.skip("should return with code 200 when update is successful.", async () => {
        const legit_prj_id = "000abc"; // TODO: find legit id
        const response = await request(app)
            .put(`/projects/${legit_prj_id}`)
            .set("Accept", "application/json")
            .send({ project: mock.upd });

        expect(response.statusCode).toBe(200);
        expect(response).toMatchObject({ id: expect.any(String) });
        // expect(response).toMatchSnapshot(mock.upd);
    });
});

describe("DELETE /projects/:id", () => {
    it.todo("should throw error when db connection is not successful.");
    it("should throw error when requested project is not found", async () => {
        const bogus_prj_id = "000abc";
        await request(app)
            .delete(`/projects/${bogus_prj_id}`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(404);
    });
    it.todo("should throw error when deletion is not succesful.");

    it.skip("should pass with response code 200 when deletion is successful.", async () => {
        const legit_prj_id = "000abc"; // TODO: figure  out how to get legit prj id
        await request(app)
            .delete(`/projects/${legit_prj_id}`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);
    });
});
