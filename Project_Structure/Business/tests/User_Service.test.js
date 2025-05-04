const UControl = require("../Subsystems/UserController.js");
const User = require("../Models/User.js");


test("User CRUD Operations", () =>{
    let userController = new UControl();
    const sam = new User("SamUnderscoreAsd", "test", "samlovesvideogames1@gmail.com");
    const fakeUser = new User("Faker", "fakerMcFakerson", "ShadowTheHedgeHog@gmail.com")
    expect(userController.createUser(sam))
    expect(userController.getUser(sam)).toBe(sam);
    expect(userController.getUser(fakeUser)).toBe(-1);
    expect(userController.updateUser(sam,"racycodehacker"));
});