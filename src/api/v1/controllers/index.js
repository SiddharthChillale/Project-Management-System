export async function rootHandler(req, res, err) {
    // res.sendFile(path.join(__rootdir, "public", "index.html"));
    res.send({}).status(200);
}
