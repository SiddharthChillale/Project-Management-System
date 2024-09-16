/*
This file exists to divert api requests to latest api-version. 
In case of damage control, change api-version to the most stable one.
*/

import app from "./app.js";
import wlogger from "./logger/winston.logger.js";

const port = process.env.PORT;
const base_url = process.env.BASE_URL;

app.listen(port, () => {
    wlogger.info(`Listening on ${base_url}:${port}`);
});
