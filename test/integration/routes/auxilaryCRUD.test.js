import app from "../../../src/app.js";
import request from "supertest";

describe("ScoreCats, Departments and Courses  : /", () => {
    it.todo("GETALL ScoreCat: should pass with code 200 on get method");
    it.todo("GETALL Departments: should pass with code 200 and on get method");
    it.todo(
        "GETALL Courses of a department: should pass with code 200 on get method"
    );
    it.todo(
        "CREATEONE ScoreCat: Should pass with code 200 and response has id when created. "
    );
    it.todo(
        "CREATEONE Department: Should pass with code 200 and response has id when created. "
    );
    it.todo(
        "CREATEONE Course in a department: Should pass with code 200 and response has id when created. "
    );
});

describe("ScoreCats, Departments and Courses : /:id", () => {
    it.todo(
        "GETONE ScoreCat: should pass with code 200 if response if Array of JSON"
    );
    it.todo(
        "GETONE Department: should pass with code 200 if response has courses"
    );
    it.todo(
        "GETONE Course of a department: should pass with code 200 on get method, include projects and participants"
    );
});

describe("updates", () => {
    it.todo("UPDATEONE ScoreCat: Should pass with code 200 when updated");
    it.todo(
        "UPDATEONE Department: Should pass with code 200 and event object in response when dept is updated by removing a course from it."
    );

    it.todo(
        "UPDATEONE Course of a department: Should pass with code 200 and event object in response when course is updated to change participants attached to it."
    );
    it.todo(
        "UPDATEONE Course of a department: Should pass with code 200 and event object in response when course is updated to change projects attached to it."
    );
});

describe("deletes", () => {
    it.todo("DELETEONE ScoreCat: Should fail when ratings are attached to it.");
    it.todo(
        "DELETEONE Department: Should fail when courses are attached to it."
    );
    it.todo(
        "DELETEONE Course: Should fail when any project/ userprofile/ is attached to it"
    );
});
