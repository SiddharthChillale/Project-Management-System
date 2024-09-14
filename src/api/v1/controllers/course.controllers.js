import CourseService from "../services/courses.services.js";

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
        console.log(`error creating course: ${error}`);
        return res.status(500).json(error);
    }

    return res
        .status(200)
        .json({ message: "succesful course creation", response });
}

export async function getCourses(req, res, err) {
    const { id, courseId } = req.params;

    let options = {
        where: {
            id: courseId,
            departmanetId: id
        },
        include: {
            projects
        }
    };

    const [result, error] = await CourseService.CRUD("R", options);

    if (error) {
        console.log(`error: ${error}`);
        return res.status(500).json(error);
    }

    return res.status(200).json(result);
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
        console.log(`error updating course: ${error}`);
        return res.status(500).json(error);
    }

    return res
        .status(200)
        .json({ message: "succesful course update", response });
}

export async function deleteCourse(req, res, err) {
    const { id } = req.params;

    const [response, error] = await CourseService.CRUD("D", {
        where: {
            id: id
        }
    });

    if (error) {
        console.log(`error deleting events: ${error}`);
        return res.status(500).json(error);
    }

    return res
        .status(200)
        .json({ message: "succesful event deletion", response });
}
