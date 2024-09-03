import app from "../api/v1/app.js";
import request from "supertest";

describe("GET /", () => {
    it("returns json object with code 200", (done) => {
        request(app)
            .get("/")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });
});
