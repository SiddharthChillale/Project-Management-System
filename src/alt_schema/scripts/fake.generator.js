import { faker } from "@faker-js/faker";

faker.seed(42);

/**
 * 1. Scorecategory
 * 2. User
 * 3. Department
 * 4. Event
 *
 * 1. UserProfile
 * 2. Course
 *
 * 1. Project
 *
 * 1. Ratings
 * 2. course-user
 * 3. event-user
 * 4. ProjectAssociation
 */
const dataConfig = {
    numEvents: 3,
    numUsers: 10,
    numDepartments: 2,
    numUserProfile: 15,
    numCourse: 3,
    numProject: 20,
    numRatings: 0,
    numProjectAssociation: 0
};

export async function generatefakeData(xprisma) {
    const userEmail = faker.internet.email();
    console.log(`creating users: start`);

    await xprisma.user.create({
        data: {
            email: userEmail,
            password: "root",
            salt: "salt",
            profiles: {
                createMany: {
                    data: [
                        {
                            email: userEmail,
                            profilePic: { url: faker.image.avatarGitHub() },
                            role: "DEVELOPER",
                            userName: userEmail.split("@")[0]
                        },
                        {
                            email: userEmail,
                            profilePic: { url: faker.image.avatarGitHub() },
                            role: "REVIEWER",
                            userName: userEmail.split("@")[0]
                        },
                        {
                            email: userEmail,
                            profilePic: { url: faker.image.avatarGitHub() },
                            role: "ADMIN",
                            userName: userEmail.split("@")[0]
                        }
                    ]
                }
            }
        }
    });
    console.log(`creating users: done `);
    console.log(`creating projects: start`);

    await xprisma.project.create({
        data: {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            teamSize: faker.number.int(10),
            publicAttachments: {
                website: faker.internet.url(),
                photos: faker.internet.url()
            },
            privateAttachments: {
                github: faker.internet.url(),
                slack: faker.internet.url()
            },
            event: {
                create: {
                    name: faker.music.album() + " " + faker.location.building,
                    startDate: faker.date.soon({ days: 1 }),
                    endDate: faker.date.soon({ days: 10 })
                }
            },
            course: {
                create: {
                    name: faker.vehicle.model(),
                    code: faker.number.int({ min: 100, max: 900 }).toString(),
                    semester: "FALL",
                    year: 2024,
                    department: {
                        create: { name: "CSE" }
                    }
                }
            }
        }
    });

    console.log(`creating projects: done`);
    return;
}

export async function clearDB(xprisma) {
    await xprisma.user.deleteMany();
    await xprisma.project.deleteMany();
    await xprisma.event.deleteMany();
    await xprisma.course.deleteMany();
    await xprisma.department.deleteMany();
}
