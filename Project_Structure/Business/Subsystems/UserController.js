class UserController{

    constructor(user_repo){
        this.user_repo = user_repo;
        this.DB = Database();
    }

    createUser(user) {
        console.log("Deez nuts createUser");
        this.DB.saveUser(user);
    }

    /**
     * Retreives a given user from the db
     * @param {User} username 
     * @returns {User}
     */
    getUser(user){
        console.log("Deez nuts getUser");
        return retrieveUser(user);
    }


}