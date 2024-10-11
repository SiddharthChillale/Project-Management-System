export async function rootHandler(req, res, err) {
    res.status(200).render("common/landing.ejs");
}

export async function sandboxHandler(req, res, err) {
    res.status(200).render("partials2/modals/profile-chooser.ejs");
}
