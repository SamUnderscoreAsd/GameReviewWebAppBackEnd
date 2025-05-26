var mysql = require("mysql2/promise");
//when using require you must make sure not to make any asynchronous calls on the global level as to avoid conflicts in the event loop, because require() is a synchronous method

const TABLE = "test_Table";

class Database {
  constructor() {
    this.con = null;

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
    //this.users.push(user);
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
   * assuming each username/email are unique to the user, we can use a SELECT and just choose
   * @returns {User}
   */
  async retrieveUser(user) {
    await this.connect();

    var sql = `SELECT username, email FROM test_Table WHERE username = "${user.username}";`;
    const [result] = await this.con.query(sql, [
      user.username, 
      user.email
    ]);

    await this.close();
    return result;
  }

  async updateUsername(user, username) {
    await this.connect();

    var sql = `UPDATE ${TABLE} SET username = "${username}" WHERE username = "${user.username}"`;

    await this.con.query(sql);

    await this.close();
  }
  async updateEmail(user, email) {
    await this.connect();

    var sql = `UPDATE ${TABLE} SET email = "${email}" WHERE email = "${user.email}"`;

    await this.con.query(sql);
    await this.close();
  }

  /**
   * TODO: add a hash function to make the password more secure on the database such that it stores the hashed value on the database and is then unhashed
   * upon accessing. Consider creating a second database table for the passwords.
   * @param {*} user 
   * @param {*} password 
   */
  async updatePassword(user, password) {
    await this.connect();

    var sql = `UPDATE ${TABLE} SET password = "${password}" WHERE username = "${user.username}"`;

    await this.con.query(sql);
    await this.close();
  }

  async deleteUser(user) {
    await this.connect();

    var sql = `DELETE FROM ${TABLE} WHERE username = "${user.username}"`;

    await this.con.query(sql);
    await this.close();
  }
}

module.exports = Database;
