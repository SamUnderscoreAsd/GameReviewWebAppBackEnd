var mysql = require("mysql2/promise");
//when using require you must make sure not to make any asynchronous calls on the global level as to avoid conflicts in the event loop, because require() is a synchronous method

class Database {
  constructor() {
    //con is not defined FIX
    this.con = null;

    /**
         * mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "deez",
            database: "TestDb"
        });
         */

    this.users = [];
  }

  async connect() {
    try {
      this.con = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "deez",
        database: "TestDb",
      });
      console.log("Connected to database successfully");
    } catch (err) {
      console.error("Couldn't connect to the database...");
      throw err;
    }
  }

  async close() {
    try {
      await this.con.end();
      this.con = null;
      console.log("Connection to the Database was closed");
    } catch (err) {
      console.error("Failed to disconnect from the database...");
      throw err;
    }
  }

  /**
   * saves a new user to the db
   * TODO: CHECK IF NEW USER EMAIL AND USERNAME ALREADY EXIST IN THE DB, if so return -1
   * TODO: MODIFY THE DATA FLOW TO NOT JUST RETURN VOID BUT TO RETURN AN INT
   * @param {User} user
   * @returns {void}
   */
  async saveUser(user) {
    this.users.push(user);
    console.log("Attempting to push user to the database");

    await this.connect();
    var sql = `INSERT INTO test_Table (username, password, email) VALUES ("${user.username}"," ${user.password}", "${user.email}")`;

    const [result] = await this.con.query(sql, [
      user.username, 
      user.password, 
      user.email
    ]);

    await this.close();
  }

  /**
   * retrives user from the db
   * TODO ADD OVERLOADED VERSIONS TO HAVE MULTIPLE SEARCH PARAMETERS: username, email, anything else that can be used in the future
   * @returns {User}
   */
  retrieveUser(user) {
    var foundPerson;
    this.users.forEach((person) => {
      //console.log("Parameter username: " + user.username +"\n Users Array Username: " +person.username);
      if (user.username === person.username) {
        console.log(
          "VALID USER FOUND: \n" +
            "Username: " +
            user.username +
            "\nPassword: " +
            user.password +
            "\nEmail: " +
            user.email
        );
        foundPerson = person;
        return; //to escape the callback function after finding the correct person
      }
    });
    return foundPerson == null ? -1 : foundPerson;
  }

  updateUsername(user, username) {
    console.log("Old user's username: " + user.username);
    const userIndex = this.users.findIndex(
      (person) => person.username === user.username
    );

    if (userIndex != -1 && user.username !== username) {
      this.users[userIndex].username = username;
    } else {
      console.log(userIndex);
      throw new Error("Invalid new username inputted.");
    }

    console.log("New user's username: " + user.username);
  }
  updateEmail(user, email) {
    console.log("Old user's email: " + user.email);
    const userIndex = this.users.findIndex(
      (person) => person.email === user.email
    );

    if (userIndex != -1 && user.email !== email) {
      this.users[userIndex].email = email;
    } else {
      console.log(userIndex);
      throw new Error("Invalid new username inputted.");
    }

    console.log("New user's email: " + user.email);
  }
  updatePassword(user, password) {
    console.log("Old user's password: " + user.password);
    const userIndex = this.users.findIndex(
      (person) => person.password === user.password
    );

    if (userIndex != -1 && user.password !== password) {
      this.users[userIndex].password = password;
    } else {
      console.log(userIndex);
      throw new Error("Invalid new username inputted.");
    }

    console.log("New user's password: " + user.password);
  }

  deleteUser(user) {
    const userIndex = this.users.findIndex((person) => person === user);

    this.users.splice(userIndex, 1);
  }
}

module.exports = Database;
