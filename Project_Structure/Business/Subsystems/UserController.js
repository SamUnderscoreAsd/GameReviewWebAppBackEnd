const Database = require("../../Persistance/Database.js");
class UserController{

    constructor(user_repo){
        this.user_repo = user_repo;
        this.DB = new Database();
    }

    createUser(user) {
        this.DB.saveUser(user);
    }

    updateUsername(user, username){
        this.DB.updateUsername(user, username);
    }

    updateEmail(user, email){
        this.DB.updateEmail(user, email);
    }

    updatePassword(user,password){
        this.DB.updatePassword(user, password);
    }

    deleteUser(user){
        this.DB.deleteUser(user);
    }

    /**
     * Retreives a given user from the db
     * @param {User} username 
     * @returns {User}
     */
    getUser(user){
        return this.DB.retrieveUser(user);
    }


}

module.exports = UserController;