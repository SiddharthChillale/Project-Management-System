const users = [
    {
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "p@ssword123"
    },
    {
        email: "jane.smith@example.com",
        firstName: "Jane",
        lastName: "Smith",
        password: "Sm1th!Jane"
    },
    {
        email: "alice.brown@example.com",
        firstName: "Alice",
        lastName: "Brown",
        password: "alice_321Brown"
    },
    {
        email: "bob.jones@example.com",
        firstName: "Bob",
        lastName: "Jones",
        password: "b0b_jones!abc"
    },
    {
        email: "emma.wilson@example.com",
        firstName: "Emma",
        lastName: "Wilson",
        password: "emma_W!1lson"
    }
];

const new_user = {
    email: "michael.clark@example.com",
    firstName: "Michael",
    lastName: "Clark",
    password: "Cl@rk1234"
};

const upd_user = {
    email: "sophia.davis@example.com",
    firstName: "Sophia",
    lastName: "Davis",
    password: "s0ph1a_D@vis"
};

const mock_user = {
    all: users,
    new: new_user,
    upd: upd_user
};

export default mock_user;
