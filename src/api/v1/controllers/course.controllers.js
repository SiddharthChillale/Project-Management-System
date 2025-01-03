import { name } from "ejs";
import wlogger from "../../../logger/winston.logger.js";
import CourseService from "../services/courses.services.js";
import { cleanDeep } from "../utils/helper.utils.js";

export async function createCourse(req, res, err) {
    const { name, code, semester, year } = req.body;
    const { id } = req.params;
    let options = {
        data: {
            name: name,
            code: code,
            semester: semester,
            year: parseInt(year),
            department: {
                connect: {
                    id: id
                }
            }
        }
    };
    const [response, error] = await CourseService.CRUD("C", options);

    if (error) {
        wlogger.error(`error creating course: ${error}`);
        return res.status(500).json(error);
    }

    return res
        .status(200)
        .json({ message: "succesful course creation", response });
}

export async function getCourses(req, res, err) {
    const { id, courseId } = req.params;
    const { user } = req;
    let options = {
        where: {
            id: courseId,
            departmentId: id
        },
        include: {
            projects: {
                select: {
                    id: true,
                    name: true
                }
            },
            userProfiles: {
                select: {
                    id: true,
                    userName: true,
                    email: true,
                    role: true
                }
            }
        }
    };
    options = cleanDeep(options);
    const [result, error] = await CourseService.CRUD("R", options);

    if (error) {
        wlogger.error(`error: ${error}`);
        return res.status(500).json(error);
    }
    if (courseId) {
        return res.status(200).render("departments/courses/detail.ejs", {
            course: result[0],
            user: user ? user : undefined
        });
    }

    return res.status(200).render("departments/courses", {
        courses: result,
        departmentId: id,
        user: user ? user : undefined
    });
}

export async function editCourse(req, res, err) {
    const { name, code, semester, year } = req.body;
    const { id, courseId } = req.params;
    let options = {
        where: {
            id: courseId
        },
        data: {
            name: name,
            code: code,
            semester: semester,
            year: parseInt(year),
            department: {
                connect: {
                    id: id
                }
            }
        }
    };
    const [response, error] = await CourseService.CRUD("U", options);

    if (error) {
        wlogger.error(`error updating course: ${error}`);
        return res.status(500).json(error);
    }

    return res.status(200).render("pages/courses.ejs", { courses: response });
}

export async function deleteCourse(req, res, err) {
    const { courseId } = req.params;

    const [response, error] = await CourseService.CRUD("D", {
        where: {
            id: courseId
        }
    });

    if (error) {
        wlogger.error(`error deleting events: ${error}`);
        return res.status(500).json(error);
    }

    return res
        .status(200)
        .json({ message: "succesful event deletion", response });
}

export async function getCreateCourseForm(req, res, err) {
    const { user } = req;
    const deptId = req.params.id;
    return res.render("departments/courses/create", { user, deptId });
}

export async function searchCourses(req, res, err) {
    const { search } = req.query;
    const options = {
        where: {},
        include: {}
    };
    const [response, error] = await CourseService.CRUD("R", options);
    if (error) {
        wlogger.error(`error in searchCourses: ${error}`);
        return res.status(500).json(error);
    }
    return res.render("departments/courses/search.ejs", { courses: response });
}
