import ProjectService from "../services/project.services.js";

export async function checkProjectExistenceById(req, res, next) {
    const [response, error] = await ProjectService.getAll({
        id: req.params.id
    });
    if (error) {
        if (error.cause?.code == "ProjectDoesNotExist") {
            res.status(404).json(error);
            return;
        }

        res.status(500).json(error);
        return;
    }
    req.body.project = response;
    next();
}
