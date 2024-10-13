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
                privateAttachments: { type: "array" },
                publicAttachments: { type: "array" }
            },
            required: ["name", "teamSize"],
            additionalProperties: { type: "string", format: "date-time" }
        }
    },
    required: ["project"],
    additionalProperties: true
};

export default ajv_instance.compile(body_project_schema);
