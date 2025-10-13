const Database = require("../../Persistance/Database.js");
class UserController{

    constructor(user_repo){
        this.user_repo = user_repo;
        this.DB = new Database();
    }

    async updateSession(sessionID, user){
        this.DB.updateSessionToken(sessionID, user);
    }

    async createUser(user) {
        this.DB.saveUser(user);
    }

    async authenticateUser(user){
        return this.DB.authenticateUser(user);
    }

    async updateUsername(user, username){
        this.DB.updateUsername(user, username);
    }

    async updateEmail(user, email){
        this.DB.updateEmail(user, email);
    }

    async updatePassword(user,password){
        this.DB.updatePassword(user, password);
    }

    async deleteUser(user){
        this.DB.deleteUser(user);
    }

    async getUser(user){
        return this.DB.retrieveUser(user);
    }

    async getSession(sessionID){
        return this.DB.retrieveSession(sessionID);
    }


}

module.exports = UserController;