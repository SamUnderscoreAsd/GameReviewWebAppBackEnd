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
        var foundPerson;
        this.users.forEach(person => {
            console.log("Parameter username: " + user.username +"\n Users Array Username: " +person.username);
            if(user.username === person.username){
                console.log("VALID USER FOUND: \n" +
                    "Username: " + user.username + 
                    "\nPassword: " + user.password +
                    "\nEmail: " + user.email );
                foundPerson = person;
            }
        });
        return foundPerson == null ? -1 : foundPerson;
    }

}

module.exports = Database;