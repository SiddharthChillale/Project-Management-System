/*
This file exists to divert api requests to latest api-version. 
In case of damage control, change api-version to the most stable one.
*/

import app from './api/v1/app.js';

const port = process.env.PORT;
const base_url = process.env.BASE_URL;

app.listen(port, ()=>{
    console.log(`Listening on ${base_url}:${port}`);
})