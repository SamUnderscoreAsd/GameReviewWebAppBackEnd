class User{
    
    constructor(username, password, email, id){
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.role = null;
    }

}

module.exports = User;