export function validateRequestBody(req, res, next) {
    if (req.body) next();
    else {
        throw Error("request doesn't have a body");
    }
}
