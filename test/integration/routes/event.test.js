import app from "../../../src/app.js";
import request from "supertest";

describe("EVENTS : /events/", () => {
    it.todo("GETALL: should pass with code 200 on get method");
    it.todo(
        "CREATEONE: Should pass with code 200 and event object in response when an event is created. "
    );
});

describe("EVENTS with id: /events/:id", () => {
    it.todo("GETONE: should pass with code 200 on get method");

    describe("updates", () => {
        it.todo(
            "UPDATEONE: Should pass with code 200 and event object in response when  participants attached to events are updated"
        );
        it.todo(
            "UPDATEONE: Should pass with code 200 and event object in response when projects attached to event are updated. "
        );
    });
    describe("deletes", () => {
        it.todo(
            "DELETEONE: Should fail when projects/ usesrprofiles are attached to it."
        );
    });
});
