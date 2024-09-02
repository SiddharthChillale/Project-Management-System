
// import process from "dotenv";

import express from "express";


const app = express();
const port = process.env.PORT;

app.get("/", (req, res)=>{
    console.log("Hit the home route");
    res.send("hello world");
})

app.listen(port, ()=>{
    console.log(`Listening on http://localhost:${port}`);
})