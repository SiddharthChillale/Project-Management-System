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

    const renderString = `<tbody hx-swap-oob="beforeend:#score-categories-table">
                            <tr id="score-cat-${response.id}">
                                <td class="is-size-6">
                                    ${response.name}
                                </td>
                                <td class="buttons are-small">

                                    <button class="button is-secondary is-light">Edit</button>
                                    <button hx-delete="/api/v1/score-category/${response.id}"
                                        hx-swap="delete" hx-target="#score-cat-${response.id}"
                                        hx-confirm="Delete category: ${response.name} ?"
                                        class="button is-danger is-light">Delete</button>
                                </td>

                            </tr>
                        </tbody>`;
    return res.status(201).send(renderString);
}

export async function getNewCategoryPage(req, res, err) {
    const { user } = req;

    return res.render("score-categories/create.ejs", { user: user });
}

export async function getEditPage(req, res, err) {
    const { user } = req;
    const { id } = req.params;
    const [scoreCat, error] = await ScoreCatService.CRUD("R", {
        where: {
            id: id
        }
    });
    if (error) {
        wlogger.error(`error in getEditPage: ${error}`);
        return res.status(500).json(error);
    }
    return res.render("score-categories/edit.ejs", {
        user: user,
        scoreCat: scoreCat[0]
    });
}

export async function getScoreCats(req, res, err) {
    // name is String
    // courses is an array of course objects
    const { id } = req.params;
    const { user } = req;
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
        return res.status(200).render("score-categories/detail.ejs", {
            scoreCat: response[0],
            user: user ? user : undefined
        });
    }
    return res.status(200).render("score-categories", {
        scoreCats: response,
        user: user ? user : undefined
    });
}

export async function updateScoreCat(req, res, err) {
    const { id } = req.params;
    const { name } = req.body;

    const options = {
        where: {
            id: id
        },
        data: {
            name: name
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

    return res.status(200);
}
