require("dotenv").config();
var mysql = require("mysql2/promise");
var bcrypt = require("bcrypt");
//when using require you must make sure not to make any asynchronous calls on the global level as to avoid conflicts in the event loop, because require() is a synchronous method

const TABLE = process.env.TABLE;
const saltRounds = 3;

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
        charset: "utf8mb4",
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
      console.log("Connection to the Database was closed");
    } catch (err) {
      console.error("Failed to disconnect from the database...");
      throw err;
    }
  }

  /**
   * saves a new user to the db
   * TODO: CHECK IF NEW USER EMAIL AND USERNAME ALREADY EXIST IN THE DB, if so return -1
   * @param {User} user
   * @returns {void}
   */
  async saveUser(user) {
    //console.log("Attempting to push user to the database");

    await this.connect();
    var sql = `INSERT INTO ${process.env.USER_TABLE} (username, password, email) VALUES (?,?,?)`;
    try {
      const hash = await bcrypt.hash(user.password, saltRounds);
      //console.log("Hashed password: " + hash);
      const [result] = await this.con.query(sql, [
        user.username,
        hash,
        user.email,
      ]);
    } catch (err) {
      console.error("Could not upload user to Database" + err);
    }

    await this.close();
  }

  /**
   * retrives user from the db
   * assuming each username/email are unique to the user, we can use a SELECT and just choose
   * @returns {User}
   */
  async retrieveUser(user) {
    await this.connect();

    var sql = `SELECT username, password, email FROM ${process.env.USER_TABLE} WHERE username = ?;`;
    const [result] = await this.con.query(sql, [
      user.username,
      user.email,
      user.password,
    ]);

    await this.close();
    return result;
  }

  async authenticateUser(user) {
    var result;

    await this.connect();

    try {
      var sql = `SELECT username, password FROM ${process.env.USER_TABLE} WHERE username = ?`;
      [result] = await this.con.query(sql, [user.username]);

      if (result.length > 0) {
        const isMatch = await new Promise((resolve, reject) => {
          bcrypt.compare(
            user.password,
            result[0].password,
            function (err, isMatch) {
              if (err) {
                reject(err);
              }
              resolve(isMatch);
            }
          );
        });
        await this.close();
        return isMatch;
      }
    } catch (err) {
      console.error(err);
    }
    await this.close();
    return false;
  }

  async updateUsername(user, username) {
    await this.connect();

    var sql = `UPDATE ${process.env.USER_TABLE} SET username = "${username}" WHERE username = "${user.username}"`;

    await this.con.query(sql);

    await this.close();
  }
  async updateEmail(user, email) {
    await this.connect();

    var sql = `UPDATE ${process.env.USER_TABLE} SET email = "${email}" WHERE email = "${user.email}"`;

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

    var sql = `UPDATE ${process.env.USER_TABLE} SET password = "${password}" WHERE username = ?`;

    await this.con.query(sql, user.username);
    await this.close();
  }

  async deleteUser(user) {
    await this.connect();

    var sql = `DELETE FROM ${process.env.USER_TABLE} WHERE username = ?`;

    await this.con.query(sql, user.username);
    await this.close();
  }
}

module.exports = Database;
