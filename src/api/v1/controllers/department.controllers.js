import wlogger from "../../../logger/winston.logger.js";
import DepartmentService from "../services/department.services.js";

export async function createDepartment(req, res, err) {
    const { name } = req.body;
    // name is String
    // courses is an array of course objects

    const options = {
        data: {
            name: name
        }
    };
    const [response, error] = await DepartmentService.CRUD("C", options);

    if (error) {
        wlogger.error(`createDepartment error: ${error}`);
        return res.status(500).json(error);
    }

    return res.status(200).redirect("/api/v1/departments");
}

export async function getDepartments(req, res, err) {
    // name is String
    // courses is an array of course objects
    const { id, includeCourses = false } = req.params;
    const { user } = req;
    let options = {
        include: {
            courses: true
        }
    };
    if (id) {
        options = { where: { id: id }, ...options };
    }

    const [response, error] = await DepartmentService.CRUD("R", options);

    if (error) {
        wlogger.error(`getDepartments error: ${JSON.stringify(error)}`);
        return res.status(500).json(error);
    }
    if (id) {
        return res.status(200).render("departments/detail.ejs", {
            department: response[0],
            user: user ? user : undefined
        });
    }
    return res.status(200).render("departments", {
        departments: response,
        user: user ? user : undefined
    });
}

export async function updateDepartment(req, res, err) {
    const { id } = req.params;
    const { name, courses } = req.body; // courses is an Array of ids

    const options = {
        where: {
            id: id
        },
        data: {
            name: name,
            courses: {
                connect: {
                    id: courses
                }
            }
        }
    };
    const [response, error] = await DepartmentService.CRUD("U", options);

    if (error) {
        wlogger.error(`updateDepartment error: ${error}`);
        return res.status(500).json(error);
    }

    return res.status(200).json(response);
}

export async function deleteDepartment(req, res, err) {
    const { id } = req.params;
    const options = {
        where: {
            id: id
        }
    };
    const [response, error] = await DepartmentService.CRUD("D", options);

    if (error) {
        wlogger.error(`deleteDepartment error: ${error}`);
        return res.status(500).json(error);
    }

    return res.status(200).json(response);
}

export async function getDepartmentCreateForm(req, res, err) {
    const { user } = req;
    return res.render("departments/create", { user });
}

export async function getDepartmentEditForm(req, res, err) {
    const { user } = req;
    const { id } = req.params;

    const options = {
        where: {
            id: id
        }
    };
    let [department, error] = await DepartmentService.findMany(options);
}
