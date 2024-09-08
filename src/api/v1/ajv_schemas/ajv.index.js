import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv_instance = new Ajv({ allErrors: true });
addFormats(ajv_instance);

export default ajv_instance;
