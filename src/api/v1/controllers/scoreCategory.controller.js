import wlogger from "../../../logger/winston.logger.js";
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
        wlogger.error(`createScoreCat error: ${error}`);
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
        wlogger.error(`getScoreCats error: ${error}`);
        return res.status(500).json(error);
    }

    if (id) {
        return res
            .status(200)
            .render("pages/one-scoreCat.ejs", { scoreCat: response[0] });
    }
    return res
        .status(200)
        .render("pages/scoreCats.ejs", { scoreCats: response });
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
        wlogger.error(`updateScoreCat error: ${error}`);
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
        wlogger.error(`deleteScoreCat error: ${error}`);
        return res.status(500).json(error);
    }

    return res.status(200).json(response);
}
