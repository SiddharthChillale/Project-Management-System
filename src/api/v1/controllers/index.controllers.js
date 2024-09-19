export async function rootHandler(req, res, err) {
    // res.sendFile(path.join(__rootdir, "public", "index.html"));
    // res.status(200).json({ message: "Hello World" });
    res.status(200).render("pages/login.ejs", { user: { name: "sidd" } });
}
