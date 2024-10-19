import { validationResult, body } from "express-validator";

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

    return res.status(400).json(extractedErrors);
    // 422: Unprocessable Entity
};

const validateUsers = [
    // Validate that each email in the `users` array is a non-empty string and a valid email
    body("users.*.email")
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Invalid email format"),

    // Middleware to handle validation errors and remove users with empty email fields
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // If there are validation errors, handle them
            // (this could also involve custom error handling logic if needed)
            return res.status(400).json({ errors: errors.array() });
        }

        // Filter out users with empty email strings
        req.body.users = req.body.users.filter(
            (user) => user.email.trim() !== ""
        );

        // Continue to the next middleware or route handler
        next();
    }
];

export default validateUsers;
