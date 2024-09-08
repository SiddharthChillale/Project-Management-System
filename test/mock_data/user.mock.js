const users = [
    {
        userName: "john_doe",
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "p@ssword123",
        profilePic: "https://example.com/images/john_doe.jpg"
    },
    {
        userName: "jane_smith",
        email: "jane.smith@example.com",
        firstName: "Jane",
        lastName: "Smith",
        password: "Sm1th!Jane",
        profilePic: "https://example.com/images/jane_smith.jpg"
    },
    {
        userName: "alice_brown",
        email: "alice.brown@example.com",
        firstName: "Alice",
        lastName: "Brown",
        password: "alice_321Brown",
        profilePic: "https://example.com/images/alice_brown.jpg"
    },
    {
        userName: "bob_jones",
        email: "bob.jones@example.com",
        firstName: "Bob",
        lastName: "Jones",
        password: "b0b_jones!abc",
        profilePic: "https://example.com/images/bob_jones.jpg"
    },
    {
        userName: "emma_wilson",
        email: "emma.wilson@example.com",
        firstName: "Emma",
        lastName: "Wilson",
        password: "emma_W!1lson",
        profilePic: "https://example.com/images/emma_wilson.jpg"
    }
];

const new_user = {
    userName: "michael_clark",
    email: "michael.clark@example.com",
    firstName: "Michael",
    lastName: "Clark",
    password: "Cl@rk1234",
    profilePic: "https://example.com/images/michael_clark.jpg"
};

const upd_user = {
    userName: "sophia_davis",
    email: "sophia.davis@example.com",
    firstName: "Sophia",
    lastName: "Davis",
    password: "s0ph1a_D@vis",
    profilePic: "https://example.com/images/sophia_davis.jpg"
};

const mock_user = {
    all: users,
    new: new_user,
    upd: upd_user
};

export default mock_user;
