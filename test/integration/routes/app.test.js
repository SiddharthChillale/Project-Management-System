import app from "../../../src/app.js";
import request from "supertest";

describe("[HEALTHCHECK] GET /", () => {
    it("should pass if reponse code is 200 and a JSON object", (done) => {
        request(app)
            .get("/")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });
});
