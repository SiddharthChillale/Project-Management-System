import ajv_instance from "./ajv_instance.js";

const body_project_schema = {
    type: "object",
    properties: {
        project: {
            type: "object",
            properties: {
                name: { type: "string" },
                teamSize: { type: "integer" },
                description: { type: "string" },
                privateAttachments: {
                    type: "array",
                    items: { type: "object" }
                },
                publicAttachments: {
                    type: "array",
                    items: { type: "object" }
                }
            },
            additionalProperties: { type: "string", format: "date-time" }
        }
    },
    required: ["project"],
    additionalProperties: true
};

export default ajv_instance.compile(body_project_schema);
