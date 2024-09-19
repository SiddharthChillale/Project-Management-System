import { prisma } from "../../src/api/v1/services/main.services.js";
import { faker } from "@faker-js/faker";
import { generateOneTimeToken } from "../../src/api/v1/services/user.services.js";
import wlogger from "../../src/logger/winston.logger.js";
import { Role, Status } from "@prisma/client";
import crypto from "node:crypto";
/**
 * Primary Tables:
 * Users
 * Score-Categories
 * Departments
 *
 * Secondary Tables:
 * Courses
 * Projects
 * Event
 * User-Profile
 *
 * Tertiary Tables:
 * Project-Associations
 * user_profile_courses
 * user_profile_events
 *
 * Quaternary Tables:
 * Ratings
 *
 */

// TODO: how to make sure there are no duplicate entries in the tables?

async function dumUser() {
    const email = faker.internet.email();
    const oneTimeToken = await generateOneTimeToken(email);
    const password = "root";
    const salt = "salt";
    const hashedPassword = crypto
        .scryptSync(password, salt, 12)
        .toString("base64");
    return {
        email: email,
        password: hashedPassword,
        salt: salt,
        oneTimeToken: oneTimeToken
    };
}
async function dumUserTable(numUsers) {
    wlogger.info(`creating users: start`);
    let userIds = [];
    const users = await Promise.all(
        Array.from({ length: numUsers }, () => dumUser())
    );
    try {
        const response = await prisma.user.createManyAndReturn({
            data: users,
            select: {
                id: true,
                email: true
            }
        });

        response.forEach((user) => {
            userIds.push(user.id);
            // mUserEmails.set(user.id, user.email);
        });
        wlogger.info(`creating users: done `);
        return [userIds, response];
    } catch (error) {
        wlogger.error(`error in dumUserTable: ${error}`);
        return [undefined, undefined];
    }
}
function dumScoreCategory() {
    return {
        name: faker.food.adjective()
    };
}
async function dumScoreCategoryTable(numScoreCategories) {
    wlogger.info(`creating score-categories: start`);
    let scoreCategoryIds = [];
    const scoreCategories = Array.from({ length: numScoreCategories }, () =>
        dumScoreCategory()
    );
    try {
        const response = await prisma.scoreCategory.createManyAndReturn({
            data: scoreCategories,
            select: {
                id: true
            }
        });
        response.forEach((scoreCategory) =>
            scoreCategoryIds.push(scoreCategory.id)
        );
        wlogger.info(`creating score-categories: done `);
        return [scoreCategoryIds, response];
    } catch (error) {
        wlogger.error(`error in dumScoreCategoryTable: ${error}`);
        return [undefined, undefined];
    }
}
function dumDepartment() {
    // if (courseList && courseList.length != 0) {
    //     return {
    //         name: `dept-${faker.location.buildingNumber()}${faker.location.city()}`,
    //         courses: courseList
    //     };
    // }

    return {
        name: `dept-${faker.location.buildingNumber()}${faker.location.city()}`
    };
}
async function dumDepartmentTable(numDepartments) {
    wlogger.info(`creating departments: start`);
    let departmentIds = [];
    const departments = Array.from({ length: numDepartments }, () =>
        dumDepartment()
    );
    try {
        const response = await prisma.department.createManyAndReturn({
            data: departments,
            select: {
                id: true
            }
        });
        response.forEach((department) => departmentIds.push(department.id));
        wlogger.info(`creating departments: done `);
        return [departmentIds, response];
    } catch (error) {
        wlogger.error(`error in dumDepartmentTable: ${error}`);
        return [undefined, undefined];
    }
}
async function primaryTables(params) {
    wlogger.info("filling primary tables");
    const [userIds, response] = await dumUserTable(params.numUsers);
    const [scoreCategoryIds, scoreCatResponse] = await dumScoreCategoryTable(
        params.numScoreCategories
    );
    const [departmentIds, departmentResponse] = await dumDepartmentTable(
        params.numDepartments
    );

    const parent = {
        users: { ids: userIds, response: response },
        scoreCategories: { ids: scoreCategoryIds, response: scoreCatResponse },
        departments: { ids: departmentIds, response: departmentResponse }
    };
    wlogger.info("primary tables filled");
    return parent;
}
//////////////////////////////////////////secondary/////////////////////////////////////////
function dumCourse(departmentId) {
    return {
        name: `course-${faker.music.genre()}`,
        code: faker.number.int({ min: 100, max: 900 }).toString(),
        semester: faker.helpers.arrayElement([
            "FALL",
            "SPRING",
            "WINTER",
            "SUMMER"
        ]),
        year: faker.number.int({ min: 2024, max: 2030 }),
        departmentId: departmentId
    };
}

async function dumCourseTable(departmentIds, numCourses) {
    wlogger.info(`creating courses: start`);
    let courseIds = [];
    // const courses = Array.from({ length: numCourses }, () =>
    let courses = [];
    //     dumCourse(faker.helpers.arrayElement(departments.ids))
    // );

    for (let i = 0; i < numCourses; i++) {
        const one = dumCourse(faker.helpers.arrayElement(departmentIds));
        courses.push(one);
    }

    try {
        const response = await prisma.course.createManyAndReturn({
            data: courses,
            select: {
                id: true
            }
        });
        response.forEach((course) => courseIds.push(course.id));
        wlogger.info(`creating courses: done `);
        return [courseIds, response];
    } catch (error) {
        wlogger.error(`error in dumCourseTable: ${error}`);
        return [undefined, undefined];
    }
}

async function dumUserProfile(user) {
    const p = Role;
    const rrole = faker.helpers.objectValue(Role);
    const v = Role.PROJECT_MANAGER;
    return {
        email: user.email,
        userName: user.email.split("@")[0],
        role: faker.helpers.objectValue(Role),
        userId: user.id,
        profilePic: { url: faker.image.avatarGitHub() }
    };
}

async function dumUserProfileTable(users, numUserProfiles) {
    wlogger.info(`creating user-profiles: start`);
    let profileIds = [];
    // let profileRole = [];
    // const profiles = await Promise.all(
    //     Array.from({ length: numUserProfiles }, () => {

    //     })
    // );
    let uprofiles = [];

    for (let i = 0; i < numUserProfiles; i++) {
        const a = faker.helpers.arrayElement(users);
        const one = await dumUserProfile(a);
        uprofiles.push(one);
    }
    try {
        const response = await prisma.userProfile.createManyAndReturn({
            data: uprofiles,
            select: {
                id: true,
                email: true,
                role: true
            }
        });
        response.forEach((profile) => {
            profileIds.push(profile.id);
            // profileRole.push({ id: profile.id, role: profile.role });
        });
        wlogger.info(`creating user-profiles: done `);
        return [profileIds, response];
    } catch (error) {
        wlogger.error(`error in dumUserProfileTable: ${error}`);
        return [undefined, undefined];
    }
}

function dumEvent(profileId) {
    return {
        name: faker.commerce.productName(),
        startDate: faker.date.soon({ days: 1 }),
        endDate: faker.date.soon({ days: 10 }),
        creatorProfileId: profileId
    };
}

async function dumEventTable(profiles, numOfEvents) {
    wlogger.info(`creating events: start`);
    let eventIds = [];
    let eventCreatorIds = [];
    for (const profile of profiles) {
        if (
            profile.role == Role.ADMIN ||
            profile.role == Role.PROJECT_MANAGER
        ) {
            eventCreatorIds.push(profile.id);
        }
    }

    // let events = [];
    // for (let i = 0; i < numOfEvents; i++) {
    //     const one = dumEvent(faker.helpers.arrayElement(eventCreatorIds));
    //     events.push(one);
    // }
    const events = faker.helpers.multiple(
        () => {
            return dumEvent(faker.helpers.arrayElement(eventCreatorIds));
        },
        { count: numOfEvents }
    );

    try {
        const response = await prisma.event.createManyAndReturn({
            data: events,
            select: {
                id: true
            }
        });
        response.forEach((event) => eventIds.push(event.id));
        wlogger.info(`creating events: done `);
        return [eventIds, response];
    } catch (error) {
        wlogger.error(`error in dumEventTable: ${error}`);
        return [undefined, undefined];
    }
}

function dumProject(profileId) {
    return {
        name: faker.commerce.productName(),
        description:
            faker.commerce.productDescription() +
            " <p> " +
            faker.lorem.sentences() +
            " <p> " +
            faker.lorem.sentences() +
            " <p> " +
            faker.lorem.sentences(),
        teamSize: faker.number.int({ min: 2, max: 10 }),
        publicAttachments: {
            website: faker.internet.url(),
            photos: faker.internet.url()
        },
        privateAttachments: {
            github: faker.internet.url(),
            slack: faker.internet.url()
        },
        creatorProfileId: profileId
    };
}

async function dumProjectTable(profiles, numOfProjects) {
    wlogger.info(`creating projects: start`);
    let projectIds = [];
    let projectCreatorIds = [];

    await profiles.map((profile) => {
        if (profile.role == Role.ADMIN || profile.role == Role.PROJECT_MANAGER)
            projectCreatorIds.push(profile.id);
    });

    const projects = Array.from({ length: numOfProjects }, () =>
        dumProject(faker.helpers.arrayElement(projectCreatorIds))
    );
    try {
        const response = await prisma.project.createManyAndReturn({
            data: projects,
            select: {
                id: true
            }
        });
        response.forEach((project) => projectIds.push(project.id));
        wlogger.info(`creating projects: done `);
        return [projectIds, response];
    } catch (error) {
        wlogger.error(`error in dumProjectTable: ${error}`);
        return [undefined, undefined];
    }
}

async function secondaryTables(parent, params) {
    wlogger.info("filling secondary tables");
    const [userProfileIds, profileResponse] = await dumUserProfileTable(
        parent.users.response,
        params.numUserProfiles
    );

    parent = {
        ...parent,
        profiles: { ids: userProfileIds, response: profileResponse }
    };
    //add courses with their departments
    const [courseIds, courseResponse] = await dumCourseTable(
        parent.departments.ids,
        params.numCourses
    );
    //add events with their creators
    const [eventIds, eventResponse] = await dumEventTable(
        parent.profiles.response,
        params.numEvents
    );

    //add projects with their creators
    const [projectIds, projectResponse] = await dumProjectTable(
        parent.profiles.response,
        params.numProjects
    );

    parent = {
        ...parent,
        courses: { ids: courseIds, response: courseResponse },
        projects: { ids: projectIds, response: projectResponse },
        events: { ids: eventIds, response: eventResponse }
    };
    wlogger.info("secondary tables filled");
    return parent;
}

/////////////////////////////////////tertiary/////////////////////////////////////////

async function dumProjectAssociationTable(
    profiles,
    projectIds,
    numOfAssociations
) {
    wlogger.info(`creating project-associations: start`);
    let assocIds = [];
    let associations = [];
    let participantProfiles = [];

    for (const profile of profiles) {
        if (profile.role != Role.ADMIN && profile.eole != Role.PUBLIC)
            participantProfiles.push(profile);
    }

    for (let i = 0; i < numOfAssociations; i++) {
        const profile = faker.helpers.arrayElement(participantProfiles);
        const profileId = profile.id;
        const projectId = faker.helpers.arrayElement(projectIds);
        const one = {
            status: faker.helpers.objectValue(Status),
            userRole: profile.role,
            userProfileId: profileId,
            projectId: projectId
        };
        associations.push(one);
    }

    let response;
    try {
        response = await prisma.projectAssociation.createManyAndReturn({
            data: associations,
            select: {
                id: true,
                userRole: true,
                projectId: true,
                userProfileId: true
            }
        });
    } catch (error) {
        wlogger.error(`error in dumProjectAssociationTable: ${error}`);

        return [undefined, undefined];
    }
    response.forEach((association) => assocIds.push(association.id));
    return [assocIds, response];
}

async function course_projects(numCP, courseIds, projectIds) {
    wlogger.info(`creating course-project: start`);
    let courseProjectPromises = [];

    for (let i = 0; i < numCP; i++) {
        const projectId = faker.helpers.arrayElement(projectIds);
        const courseId = faker.helpers.arrayElement(courseIds);
        const result = prisma.project.update({
            where: {
                id: projectId
            },
            data: {
                course: {
                    connect: {
                        id: courseId
                    }
                }
            }
        });

        courseProjectPromises.push(result);
    }

    try {
        await Promise.all(courseProjectPromises).then((result) => {
            wlogger.info(`creating course-projects: done `);
            return [result, null];
        });
    } catch (error) {
        wlogger.error(`error in course_projects: ${error}`);
        return [undefined, error];
    }
}
async function event_projects(numCP, eventIds, projectIds) {
    wlogger.info(`creating event-project: start`);
    let eventProjectPromises = [];

    for (let i = 0; i < numCP; i++) {
        const projectId = faker.helpers.arrayElement(projectIds);
        const eventId = faker.helpers.arrayElement(eventIds);
        const result = prisma.project.update({
            where: {
                id: projectId
            },
            data: {
                event: {
                    connect: {
                        id: eventId
                    }
                }
            }
        });

        eventProjectPromises.push(result);
    }

    try {
        await Promise.all(eventProjectPromises).then((result) => {
            wlogger.info(`creating event-projects: done `);
            return [result, null];
        });
    } catch (error) {
        wlogger.error(`error in event_projects: ${error}`);
        return [undefined, error];
    }
}

async function tertiaryTables(parent, params) {
    wlogger.info("filling tertiary tables");

    const [projectAssociationIds, projectAssociationResponse] =
        await dumProjectAssociationTable(
            parent.profiles.response,
            parent.projects.ids,
            params.numProjectAssociations
        );

    // try {
    await course_projects(
        params.numCourseProjects,
        parent.courses.ids,
        parent.projects.ids
    );
    // } catch (error) {
    //     wlogger.error(`error in courseprofiles: ${error}`);
    //     return error;
    // }
    try {
        await event_projects(
            params.numEventProjects,
            parent.events.ids,
            parent.projects.ids
        );
    } catch (error) {
        wlogger.error(`error in eventprojects: ${error}`);
        return error;
    }

    parent = {
        ...parent,
        projectAssociations: {
            ids: projectAssociationIds,
            response: projectAssociationResponse
        }
    };
    wlogger.info("tertiary tables filled");
    return parent;
}

//////////////////////////////////////////quaternary/////////////////////////////////////////

async function dumRatingsTable(
    projectIds,
    profiles,
    scoreCategoryIds,
    numOfRatings
) {
    wlogger.info(`creating ratings: start`);
    let ratingIds = [];
    let reviewerProfileIds = [];
    profiles.forEach((profile) => {
        if (profile.role == Role.REVIEWER) reviewerProfileIds.push(profile.id);
    });
    const ratings = Array.from({ length: numOfRatings }, () => {
        const rprofileId = faker.helpers.arrayElement(reviewerProfileIds);
        const projectId = faker.helpers.arrayElement(projectIds);
        const scoreCategoryId = faker.helpers.arrayElement(scoreCategoryIds);
        return {
            score: faker.number.int({ min: 0, max: 5 }),
            scoreCategoryId: scoreCategoryId,
            projectId: projectId,
            userProfileId: rprofileId
        };
    });
    try {
        const response = await prisma.ratings.createManyAndReturn({
            data: ratings,
            select: {
                id: true,
                projectId: true,
                userProfileId: true
            }
        });
        response.forEach((rating) => ratingIds.push(rating.id));
        wlogger.info(`creating ratings: done `);
        return [ratingIds, response];
    } catch (error) {
        wlogger.error(`error in dumRatingsTable: ${error}`);
        return [undefined, undefined];
    }
}

async function quaternaryTables(parent, params) {
    wlogger.info("filling quaternary tables");
    const [ratingIds, ratingResponse] = await dumRatingsTable(
        parent.projects.ids,
        parent.profiles.response,
        parent.scoreCategories.ids,
        params.numRatings
    );

    parent = {
        ...parent,
        ratings: {
            ids: ratingIds,
            response: ratingResponse
        }
    };
    wlogger.info("quaternary tables filled");
    return parent;
}

///////////////////////////////////////////////////////////////////////////////////

async function setup() {
    wlogger.info("starting setup");
    // teardown the db
    // create the primary tables
    await teardown();

    let parents;
    const params = {
        numUsers: 20,
        numUserProfiles: 15,
        numScoreCategories: 5,
        numDepartments: 5,
        numCourses: 2,
        numProjects: 20,
        numProjectAssociations: 7,
        numEvents: 3,
        numRatings: 2,
        numCourseProfiles: 6,
        numCourseProjects: 10,
        numEventProjects: 10
    };
    try {
        parents = await primaryTables(params);
        parents = await secondaryTables(parents, params);
        parents = await tertiaryTables(parents, params);
        parents = await quaternaryTables(parents, params);
    } catch (error) {
        wlogger.error(`error in setup: ${error}`);
    }
    wlogger.info("setup done");
}
async function teardown() {
    // clear the test db
    // delete the quarternary tables
    // delete the tertiary tables
    // delete the secondary tables
    // delete the primary tables
    wlogger.info("tearing down");

    try {
        await prisma.ratings.deleteMany();
        await prisma.projectAssociation.deleteMany();
        await prisma.project.deleteMany();
        await prisma.event.deleteMany();
        await prisma.course.deleteMany();
        await prisma.userProfile.deleteMany();

        await prisma.department.deleteMany();
        await prisma.scoreCategory.deleteMany();
        await prisma.user.deleteMany();
    } catch (error) {
        wlogger.error(`error in teardown: ${error}`);
    }

    wlogger.info("tearing done");
}

async function main() {
    await setup();
}

main()
    .then(() => {
        wlogger.info("DB-Builder complete");
    })
    .finally(async () => {
        // await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        // await prisma.$disconnect();
        process.exit(1);
    });
