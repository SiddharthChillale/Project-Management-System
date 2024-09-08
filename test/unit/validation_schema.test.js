import validateRequestBody from "../../src/api/v1/middleware/validation";
import aproject_schema from "../../src/api/v1/ajv_schemas/project.schema.js";
import mock from "../mock_data/project";

const mockReq = (body) => ({ body });
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
const mockNext = jest.fn();

describe("Mandatory Fields check", () => {
    let ajvCompiledMock;

    beforeEach(() => {
        ajvCompiledMock = aproject_schema;
        jest.clearAllMocks(); // Reset mock calls for each test
    });
    it("should call next() when validation passes", () => {
        // Arrange: Mock ajvCompiled to return true (valid request)
        // ajvCompiledMock.mockReturnValue(true);
        const req = mockReq({ project: mock.upd, user: "myself" });
        const res = mockRes();

        const validateMiddleware = validateRequestBody(ajvCompiledMock);

        // Act: Call the middleware
        validateMiddleware(req, res, mockNext);

        // Assert: next() should be called, no error response
        expect(mockNext).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 status with error when validation fails", () => {
        // Arrange: Mock ajvCompiled to return false and set errors
        // const validationErrors = [{ message: "Invalid data" }];
        // ajvCompiledMock.mockReturnValue(false);
        // ajvCompiledMock.errors = validationErrors;

        const req = mockReq({ namaste: "" }); // Invalid request data
        const res = mockRes();

        const validateMiddleware = validateRequestBody(ajvCompiledMock);

        // Act: Call the middleware
        validateMiddleware(req, res, mockNext);

        // Assert: res.status(400) and res.json should be called with errors
        expect(res.status).toHaveBeenCalledWith(400);
        // expect(res.json).toHaveBeenCalledWith(validationErrors);
        expect(mockNext).not.toHaveBeenCalled();
    });
});
