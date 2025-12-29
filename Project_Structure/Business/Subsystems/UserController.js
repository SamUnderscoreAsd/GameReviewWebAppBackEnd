const Database = require("../../Persistance/Database.js");

class UserController{

    constructor(user_repo){
        this.user_repo = user_repo;
        this.DB = new Database();
    }

    async getReviews(requestType, id){
        if(requestType === "games"){
            return this.DB.getGameReviews(id);
        }
        else if(requestType === "user"){
            return this.DB.getUserReviews(id);
        }
    }

    async createReview(user, gameId, review, reviewScore){
        this.DB.createReview(user,gameId,review, reviewScore);
    }

    async updateReview(review, reviewScore, reviewId){
        this.DB.updateReview(review, reviewScore,reviewId);
    }

    async deleteReview(reviewId){
        this.DB.deleteReview(reviewId);
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