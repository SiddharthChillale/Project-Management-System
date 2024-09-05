import { getOneProject } from "../services/project";

export async function checkProjectExistenceById(req, res, next) {
    const id = req.params.id;
    const [response, error] = await getOneProject(id);
    if (error) {
        //console.log(`project existence error: ${error}`);
        res.status(404).send(error);
        return;
    }
    //console.log(`Project exists: ${response.name}`);
    req.body.project = response;
    next();
}
