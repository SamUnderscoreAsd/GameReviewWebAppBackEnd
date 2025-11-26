jest.mock('../../Persistance/Database.js');
const UC = require("../Subsystems/UserController.js");
const User = require("../Models/User.js");
const database = require('../../Persistance/Database.js');
const passport = require("passport");

//TODO: look into mocking data set for testing and code coverage

describe("User CRUD Operations", () => {
  const controller = new UC();
  var person;

  beforeEach(() => {
    person = new User("SAM_EPIC_TEST_USER", "TestTestTest", "TEST@gmail.com");

    jest.clearAllMocks();
  });

  describe("Create Operation", () => {
    test("should create a user ", async () => {
        database.mockResolvedValue({
          user: {
            username: "SAM_EPIC_TEST_USER",
            email: "TEST@gmail.com",
            password: '$2b$10$hashedPassword123',
          },
        });

        const result = await controller.createUser(person);
        
        expect(database).toHaveBeenCalledWith(person);

        expect(result.username).toBe("SAM_EPIC_TEST_USER");
        expect(result.email).toBe("Test@gmail.com");
    });

    test.skip("should fail to create a user ", () => {});
  });

  describe("Read Operation", () => {
    test.skip("should retrieve a existing user", () => {});

    test.skip("should fail to retrieve a user that doesn't exist", () => {});
  });

  describe("Update Operation", () => {
    test.skip("should update a user's username to something else", () => {});

    test.skip("should update a user's email to something else", () => {});

    test.skip("should update user's password to something else", () => {});
  });

  describe("Delete Operation", () => {
    test.skip("should delete a user from a database", () => {});
  });
});

// test("User Login Authentication", async () =>{

//     let userController = new UC();
//     const realUser = new User("JohnCarlos2012", "panasonicFIUaustin");

//     expect(await userController.authenticateUser(realUser));
// })
