import app from "../api/v1/app.js";
import request from "supertest";

describe("GET /projects", () => {
    it("should return with code 200 if response body is JSON object", async () => {
        await request(app)
            .get("/projects")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);
    });

    it("should return with code 200 if response body matches projectObject when req.query.Id is given", async () => {
        const projectObject = {
            name: expect.any(String),
            description: expect.any(String),
            team_size: expect.any(Number),
            attachments: expect.any(Object),
        };

        await request(app)
            .get("/projects")
            .query({ id: 3 })
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
            .query({ id: 30 })
            .set("Accept", "application/json")
            .expect(404);
    });

    it.todo("should pass if request method is GET");
    it.todo("should throw error if db connection is unsuccessful");
    it.todo("should return with code 200 if response body is JSON object");
});

describe("POST /projects", () => {
    it.todo("should pass if request body matches projectObject");
    it.todo("should pass if request method is POST");
    it.todo("should throw error if db connection is not successful");
    it.todo("should throw error if insertion is not successful");
    it.todo(
        "should return with code 200 if response status is 200 on successful insertion.",
    );
    it.todo(
        "Should return with code 200 if response body has project Id of inserted project.",
    );
});

describe("PUT /projects", () => {
    it.todo("should pass if request method is PUT");
    it.todo("should pass if request body matches {{id}, {projectObject}}");
    it.todo("should throw error if db connection is not successful");
    it.todo("should throw error if requested project is not present in db");
    it.todo("should throw error if updation is not successful");
    it.todo("should return with code 200 on successful updation.");
});

describe("DELETE /projects", () => {
    it("can delete projects", async () => {
        await request(app)
            .delete("/projects")
            .query({ id: 3 })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);
    });

    it.todo("should pass if request method is DELETE");
    it.todo("should pass if request body contain project id to delete");
    it.todo("should throw error if db connection is not successful");
    it.todo("should throw error if requested project is not found");
    it.todo("should throw error if deletion is not succesfull");
    it.todo("should return with code 200 on successful deletion.");
});
