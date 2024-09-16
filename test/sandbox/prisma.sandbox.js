import { createUsers } from "../../src/api/v1/controllers/user.controllers.js";
import DepartmentService from "../../src/api/v1/services/department.services.js";
import ScoreCatService from "../../src/api/v1/services/scoreCategory.services.js";
import {
    ProfileService,
    PrismaEnums
} from "../../src/api/v1/services/user.services.js";
import { UserService } from "../../src/api/v1/services/user.services.js";
import { faker } from "@faker-js/faker";

function createUser(_email = undefined, _password = undefined) {
    const email = _email || faker.internet.email();
    const password = _password || faker.word.noun();
    return { email, password };
}

function createCourse() {
    return {
        name: `course-${faker.music.genre()}`,
        code: faker.number.int({ min: 100, max: 900 }).toString(),
        semester: faker.helpers.arrayElement([
            "FALL",
            "SPRING",
            "WINTER",
            "SUMMER"
        ]),
        year: faker.number.int({ min: 2024, max: 2030 })
    };
}

function createDept(courseList) {
    if (courseList && courseList.length != 0) {
        return {
            name: `dept-${faker.location.buildingNumber()}${faker.location.city()}`,
            courses: courseList
        };
    }

    return {
        name: `dept-${faker.location.buildingNumber()}${faker.location.city()}`
    };
}

function createScoreCat() {
    return {
        name: faker.food.adjective()
    };
}

const Creators = {
    dept: createDept,
    course: createCourse,
    score_cat: createScoreCat,
    user: createUser
};

async function testCreateProfile() {
    const id = 2;
    const email = "abc.xyz@gmail.com";
    const [response, error] = await ProfileService.create(email, id, "ADMIN");
    wlogger.error(`error: ${error}`);
    wlogger.info(`response: ${response}`);
}
async function testBulkCreation() {
    const manyUserEmails = Array.from({ length: 10 }, () => Creators.user());
    const [response, error] = await UserService.createForToken(manyUserEmails);
    wlogger.error(`error: ${error}`);
    wlogger.info(`response: ${response}`);
}

async function testBulkCreationreq(role = undefined) {
    const manyUserEmails = Array.from({ length: 5 }, () => Creators.user());
    const req = { body: { dataArray: manyUserEmails, role: role } };
    const [response, error] = await createUsers(req, null, null);
    wlogger.error(`error: ${error}`);
    wlogger.info(`response: ${response}`);
}

async function testAuxCreation() {
    const deptList = Array.from(
        { length: faker.helpers.rangeToNumber({ min: 1, max: 3 }) },
        () => {
            const numCourses = faker.helpers.rangeToNumber({ min: 1, max: 3 });
            const courseList = Array.from({ length: numCourses }, () =>
                Creators.course()
            );

            //put a course list in a department with a chance of 20%
            if (faker.datatype.boolean({ probability: 0.45 })) {
                return Creators.dept(courseList);
            }
            return Creators.dept();
        }
    );

    const scoreCatList = Array.from(
        { length: faker.helpers.rangeToNumber({ min: 1, max: 3 }) },
        () => Creators.score_cat()
    );

    for (const dept of deptList) {
        const options = { data: dept };
        await DepartmentService.CRUD("C", options);
    }
    for (const scoreCat of scoreCatList) {
        const options = { data: scoreCat };
        await ScoreCatService.CRUD("C", options);
    }
}

async function main() {
    wlogger.info("started");
    const roles = { ...PrismaEnums, undef: undefined };
    const role = faker.helpers.objectValue(roles);
    let timenow = performance.now();
    await testAuxCreation();
    timenow = performance.now() - timenow;
    wlogger.info(`Time taken: ${timenow.toFixed(2)} milliseconds`);
    wlogger.info("ended");
}

main()
    .then(() => {
        wlogger.info("\nUpdate complete");
    })
    .finally(async () => {
        // await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        // await prisma.$disconnect();
        process.exit(1);
    });
