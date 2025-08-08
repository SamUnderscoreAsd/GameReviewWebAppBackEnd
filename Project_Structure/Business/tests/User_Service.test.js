const UControl = require("../Subsystems/UserController.js");
const User = require("../Models/User.js");


//TODO: look into mocking data set for testing and code coverage

test("User CRUD Operations", async () =>{
    let userController = new UControl();
    const sam = new User("SamUnderscoreAsd", "test", "samlovesvideogames1@gmail.com");
    const fakeUser = new User("Faker", "fakerMcFakerson", "ShadowTheHedgeHog@gmail.com");
    expect(await userController.createUser(sam));
    expect(await userController.getUser(fakeUser));
    expect(await userController.updateUsername(sam,"racycodehacker"));
    expect(await userController.deleteUser(sam));
    expect(await userController.getUser(sam));
});

test("User Login Authentication", async () =>{

    let userController = new UControl();
    const realUser = new User("JohnCarlos2012", "panasonicFIUaustin");
    
    expect(await userController.authenticateUser(realUser));
})