import ajv_instance from "./ajv.index.js";

const body_project_schema = {
    type: "object",
    properties: {
        project: {
            type: "object",
            properties: {
                name: { type: "string" },
                teamSize: { type: "integer" },
                description: { type: "string" },
                attachments: { type: "object" }
            },
            required: ["name", "teamSize"],
            additionalProperties: true
        }
    },
    required: ["project"],
    additionalProperties: true
};

export default ajv_instance.compile(body_project_schema);
