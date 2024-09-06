export default function validateRequestBody(ajvCompiled) {
    return (req, res, next) => {
        let error = undefined;

        const request_body = req.body;
        const valid = ajvCompiled(request_body);
        if (!valid) {
            error = ajvCompiled.errors;
            res.status(400).json(error);
            return;
        }

        next();
    };
}
