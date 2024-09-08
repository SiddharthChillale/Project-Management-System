export default function checkForSchema(compiledAjvSchema) {
    return (req, res, next) => {
        let error = undefined;

        const request_body = req.body;
        const valid = compiledAjvSchema(request_body);
        if (!valid) {
            error = compiledAjvSchema.errors;
            res.status(400).json(error);
            return;
        }

        next();
    };
}
