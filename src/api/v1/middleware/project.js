import { getOneProject } from "../services/project";

export async function checkProjectExistenceById(req, res, next) {
    const [response, error] = await getOneProject({ id: req.params.id });
    if (error) {
        if (error.cause?.code == "ProjectDoesNotExist") {
            res.status(404).send(error);
            return;
        }

        res.status(500).send(error);
        return;
    }
    req.body.project = response;
    next();
}
