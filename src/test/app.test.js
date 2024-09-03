import app from "../app.js";
import request from "supertest";

describe("GET /", () => {
    it("returns json object with code 200", (done) => {
        request(app)
            .get("/")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });

    it.todo("should return with code 200");
    it.todo("should throw error if response body is not HTML.");
});
