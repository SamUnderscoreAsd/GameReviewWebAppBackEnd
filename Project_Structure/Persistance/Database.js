class Database{

    constructor(){
        this.users = [];
    }

    /**
     * saves a new user to the db
     * @param {User} user 
     * @returns {void}
     */
    saveUser(user){
        this.users.push(user);
    }

    /**
     * retrives user from the db
     * TODO ADD OVERLOADED VERSIONS TO HAVE MULTIPLE SEARCH PARAMETERS: username, email, anything else that can be used in the future
     * @returns {User}
     */
    retrieveUser(user){
        return this.users.find(user);
    }

}