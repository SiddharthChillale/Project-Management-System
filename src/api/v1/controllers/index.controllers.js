export async function rootHandler(req, res, err) {
    // res.sendFile(path.join(__rootdir, "public", "index.html"));
    // res.status(200).json({ message: "Hello World" });
    // if(req.user){
    //     res.status(200).render("pages/dashboard.ejs", req.user);
    // }
    res.status(200).render("common/landing.ejs");
}

export async function sandboxHandler(req, res, err) {
    res.status(200).render("partials/modals/assign/profile-chooser.ejs");
}
