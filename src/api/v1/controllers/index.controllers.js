export async function rootHandler(req, res, err) {
    const { user } = req;
    if (user) {
        return res.redirect("/api/v1/users/dashboard");
    }
    return res.status(200).render("common/landing.ejs");
}

export async function sandboxHandler(req, res, err) {
    return res.status(200).render("partials2/modals/profile-chooser.ejs");
}
