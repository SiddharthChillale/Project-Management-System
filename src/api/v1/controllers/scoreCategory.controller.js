import ScoreCatService from "../services/scoreCategory.services.js";
import { cleanDeep } from "../utils/helper.utils.js";

export async function createScoreCat(req, res, err) {
    const { name } = req.body;
    // name is String
    // courses is an array of course objects

    const options = {
        data: {
            name: name
        }
    };
    const [response, error] = await ScoreCatService.CRUD("C", options);

    if (error) {
        console.log(`createScoreCat error: ${error}`);
        return res.status(500).json(error);
    }

    return res.status(200).json(response);
}

export async function getScoreCats(req, res, err) {
    // name is String
    // courses is an array of course objects
    const { id } = req.params;

    let options = {
        where: {
            id: id
        }
    };
    options = cleanDeep(options);
    // if (id) {
    //     options = { ...options, where: { id: id } };
    // }

    const [response, error] = await ScoreCatService.CRUD("R", options);

    if (error) {
        console.log(`getScoreCats error: ${error}`);
        return res.status(500).json(error);
    }

    return res.status(200).json(response);
}

export async function updateScoreCat(req, res, err) {
    const { id } = req.params;
    const { newName } = req.body.newName;

    const options = {
        where: {
            id: id
        },
        data: {
            name: newName
        }
    };
    const [response, error] = await ScoreCatService.CRUD("U", options);

    if (error) {
        console.log(`updateScoreCat error: ${error}`);
        return res.status(500).json(error);
    }

    return res.status(200).json(response);
}

export async function deleteScoreCat(req, res, err) {
    const { id } = req.params;
    const options = {
        where: {
            id: id
        }
    };
    const [response, error] = await ScoreCatService.CRUD("D", options);

    if (error) {
        console.log(`deleteScoreCat error: ${error}`);
        return res.status(500).json(error);
    }

    return res.status(200).json(response);
}
