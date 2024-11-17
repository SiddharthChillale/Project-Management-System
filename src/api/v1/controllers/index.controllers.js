export async function rootHandler(req, res, err) {
    const { user } = req;
    if (user) {
        return res.redirect("/api/v1/users/dashboard");
    }
    return res.status(200).render("common/landing.ejs");
}

export async function healthCheck(req, res, err) {
    wlogger.info("Health check");
    return res.status(200).json({ status: "ok" });
}
