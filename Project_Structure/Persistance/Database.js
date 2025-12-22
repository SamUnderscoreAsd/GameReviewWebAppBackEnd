require("dotenv").config();
var mysql = require("mysql2/promise");
var bcrypt = require("bcrypt");
//when using require you must make sure not to make any asynchronous calls on the global level as to avoid conflicts in the event loop, because require() is a synchronous method
//TODO: REDO THE CRUD OPERATIONS TO FIT NEW USERS DB
//TODO: The mysql .query() statements are leaving hanging async operations after running, I don't think its going to effect the performance of the application but check if it will.
//https://sidorares.github.io/node-mysql2/docs mysql2 docs
//TODO: ADD ERROR HANDLING, the structure to gracefully handle errors is in place. But I need to have a way for it to return specific messages if certain errors occur
//This will enable me to have more accurate/dynamic error alerts for my frontend. It also highlights faults in the system more accurately.

const saltRounds = 3;

class Database {
  constructor() {
    this.con = null;

    this.pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "deez",
      database: "USERDB",
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
      idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }

  async getGameReviews(gameId){
    var selectSQL = `SELECT r.*, u.username FROM ${process.env.REVIEW_TABLE} r INNER JOIN ${process.env.USER_TABLE} u ON r.userId = u.ID WHERE gameId = ?`;
    //var selectSQL = `SELECT review, reviewScore dateCreated from ${process.env.REVIEW_TABLE} WHERE gameId = ?`;

    try{
      const [result] = await this.pool.query(selectSQL,[
        gameId
      ]);
      return result;
    }catch(e){
      console.error(e);
    }
  }

  async getUserReviews(userId){
    //var selectSQL = `SELECT review, reviewScore dateCreated from ${process.env.REVIEW_TABLE} WHERE userId = ?`;

    try{
      const [result] = await this.pool.query(selectSQL,[
        userId
      ]);
      return result;
    }catch(e){
      console.error(e);
    }
  }

  async createReview(user, gameId, review, reviewScore) {
    console.log("In the dB user.id is : " + JSON.stringify(user));
    var insertSql = `INSERT INTO ${process.env.REVIEW_TABLE} (userId, gameId, review, reviewScore) VALUES(?,?,?,?)`;

    try {
      const [insertResults] = await this.pool.query(insertSql, [
        user.ID,
        gameId,
        review,
        reviewScore,
      ]);
    } catch (e) {
      console.error(e);
    }
    return;
  }

  async updateReview(review, reviewScore, reviewId){
    var updateSQL = `UPDATE ${process.env.REVIEW_TABLE} SET review = ?, reviewScore = ?  WHERE reviewId = ?`

    try{
      await this.pool.query(updateSQL,[
          review,
          reviewScore,
          reviewId
      ])
    }catch(e){
      console.error(e);
    }
  }

  async deleteReview(reviewId){
    var deleteSQL =  `DELETE FROM ${process.env.REVIEW_TABLE} WHERE reviewId = ?`;

    try{
      await this.pool.query(deleteSQL,reviewId);
    }
    catch(e){
      console.error(e);
    }
  };

  /**
   * Method to automatically handle session tokens for authenticated users.
   * TODO:
   * @param {*} sessionID
   */
  async updateSessionToken(sessionID, user) {
    var insertSql = `INSERT INTO ${process.env.SESSION_TABLE} (sessionID, expires) VALUES (?,?)`;
    var updateSql = `UPDATE ${process.env.USER_TABLE} SET sessionID = ?  WHERE username = ?`;

    var expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    try {
      const [insertResult] = await this.pool.query(insertSql, [
        sessionID,
        expires,
      ]);

      //console.log(`about to try and update the session table with the session ID ${sessionID} and the username ${user.username}`);
      const [updateResult] = await this.pool.query(updateSql, [
        sessionID,
        user.username,
      ]);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * saves a new user to the db
   * TODO: CHECK IF NEW USER EMAIL AND USERNAME ALREADY EXIST IN THE DB, if so return -1
   * @param {User} user
   * @returns {void}
   */
  async saveUser(user) {
    //console.log("trying to connect to database for save user method");

    var sql = `INSERT INTO ${process.env.USER_TABLE} (username, password, email) VALUES (?,?,?)`;
    try {
      const hash = await bcrypt.hash(user.password, saltRounds);
      const [result] = await this.pool.query(sql, [
        user.username,
        hash,
        user.email,
      ]);
    } catch (err) {
      console.error("Could not upload user to Database" + err);
    }
  }

  /**
   * retrives user from the db
   * assuming each username/email are unique to the user, we can use a SELECT and just choose
   * @returns {User}
   */
  async retrieveUser(user) {
    var sql = `SELECT username, password, email FROM ${process.env.USER_TABLE} WHERE username = ?;`;
    const [result] = await this.pool.query(sql, [
      user.username,
      user.email,
      user.password,
    ]);
    return result;
  }

  async retrieveSession(sessionID) {
    var sql = `SELECT u.ID, u.username, s.Expires FROM ${process.env.USER_TABLE} u INNER JOIN ${process.env.SESSION_TABLE} s ON u.SessionID = s.sessionID WHERE s.sessionID = ?`
    try {
      const [result] = await this.pool.query(sql, [sessionID]);
      return result;
    } catch (err) {
      console.error(err);
    }
  }

  async authenticateUser(user) {
    var result;

    try {
      var sql = `SELECT username, password, ID FROM ${process.env.USER_TABLE} WHERE username = ?`;
      [result] = await this.pool.query(sql, [user.username]);

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
        if (isMatch){
          return result[0].ID;
        }
      }
    } catch (err) {
      console.error(err);
    }
    return undefined;
  }

  async updateUsername(user, username) {
    var sql = `UPDATE ${process.env.USER_TABLE} SET username = "${username}" WHERE username = "${user.username}"`;

    await this.pool.query(sql);
  }
  async updateEmail(user, email) {
    var sql = `UPDATE ${process.env.USER_TABLE} SET email = "${email}" WHERE email = "${user.email}"`;

    await this.pool.query(sql);
  }

  /**
   * @param {*} user
   * @param {*} password
   */
  async updatePassword(user, password) {
    try {
      var hashedPassword = bcrypt.hash(password, saltRounds);
      var sql = `UPDATE ${process.env.USER_TABLE} SET password = "${hashedPassword}" WHERE username = ?`;
      await this.pool.query(sql, user.username);
    } catch (err) {
      console.log("Error Updating user's password" + err);
    }
  }

  async deleteUser(user) {
    var sql = `DELETE FROM ${process.env.USER_TABLE} WHERE email = ?`;
    try {
      await this.pool.query(sql, user.email);
    } catch (err) {
      console.log("couldn't delete user" + err);
    }
  }
}

module.exports = Database;
