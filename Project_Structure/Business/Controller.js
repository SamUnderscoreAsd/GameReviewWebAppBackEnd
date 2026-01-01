require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const userController = require("./Subsystems/UserController");
const User = require("./Models/User");
const cookieParser = require("cookie-parser");
const IGDBToken = require("./Subsystems/IGDBToken");

//This is the facade that will instruct the subsystems to act upon user request
var uc = new userController();

//TODO LEARN HOW TO USE EXPRESS ROUTES PROPERLY (ALEX THE GOAT)
//future note: look at redus
//TODO UPDATE ENDPOINT NAMES TO BE RESTFUL API
//TODO LEARN HOW TO PROPERLY USE JEST
//use noun based naming ask gpt

//Look into adding a middleware function that immediately accesses the user's id and append it to the req body

require("./Subsystems/auth");

app.use(express.json()); //important middleware function that parses request body data into a json which is a more usable form of data for our server

app.use(cookieParser()); //middleware function that enables easier use of implement

app.use(express.urlencoded()); //another middleware function that allows your server to handle data from requests sending urlencoded

app.use(
  cors({
    //cors package basically allows the server to specify from where its expecting a request from. its a browser protocol to prevent malicious actors from
    //being able to send requests from outside the intended locations.

    origin: process.env.FRONTEND_URL,
    //origin: "*",


    credentials: true,//allows cookies to be sent
  })
);
  
  async function sessionMiddleware(req, res, next) {
    const sessionID = req.cookies.SessionID;
    console.log(sessionID);

    const results = await uc.getSession(sessionID);
    const userid = results[0].ID;

    console.log("userId: ",userid, "\nresults:",results);

    req.user = {
      ID : userid
    };
    next();
  }

const token = new IGDBToken(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_CLIENT_SECRET);

app.post('/api/getGames', async (req,res)=>{
  await token.getValidToken();
  const body = req.body;
  const gameList = await token.gameRequestHandler(body.requestType, body.value);

  res.status(200).send(gameList);
});

app.post("/api/retreiveSession", async (req, res) => {
  const data = req.body.sessionID;
  const session = await uc.getSession(data);

  res.status(201).json({
      status: true,
      expires: session[0]
    });
});

app.post("/api/login", async (req, res) => {
  const data = req.body;

  const userID = await uc.authenticateUser(data.user);

  if(userID){
    sessionID = Math.floor(Math.random() * (99999999 - 1 + 1)) + 1; //floor(rand * (max - min + 1)) + min

      res.cookie("SessionID", sessionID.toString(), {
        maxAge: 604800000, //7 days in ms
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: undefined,
        path: '/',
      });
      uc.updateSession(sessionID, data.user);

      res.status(201).send(userID);
    }
});

app.post("/api/createReview", sessionMiddleware,async (req,res)=>{
  const data = req.body;
  await uc.createReview(req.user,data.gameId,data.review,data.reviewScore);

  res.status(201).send();
})

app.post("/api/getReviews", async (req,res)=>{
  const data = req.body;
  const results = await uc.getReviews(data.requestType, data.id);

  res.status(201).send(results);
} )

app.post("/api/updateReview", async (req,res)=>{
  const data = req.body;

  await uc.updateReview(data.review, data.reviewScore, data.reviewId);

  res.status(201).send();
})

app.post("/api/deleteReview", async (req,res)=>{
  const data = req.body;

  //TODO: CHECK IF USERID MATCHES COOKIE USER ID

  await uc.deleteReview(data.reviewId);

  res.status(201).send();
})

app.post("/api/getUser", (req, res) => {
  const data = req.body;
  uc.getUser(data.user).then((retrievedData) => {
    res.status(201).send(retrievedData);
  });
});

app.post("/api/createUser", (req, res) => {
  const data = req.body;

  uc.createUser(
    new User(data.user.username, data.user.password, data.user.email)
  );

  sessionID = Math.floor(Math.random() * (99999999 - 1 + 1)) + 1; //floor(rand * (max - min + 1)) + min
  res.cookie("SessionID", sessionID.toString(), {
    maxAge: 604800000, //7 days in ms
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: undefined,
    path: '/',
  });
  uc.updateSession(sessionID, data.user);

  res.status(201).json({ message: "User made successfully", data: data });
});

app.post("/api/updateUsername", (req, res) => {
  //console.log("Updating a user now...");
  const data = req.body;
  uc.updateUsername(data.user, data.username);
  res.send(
    "Old username: " + data.user.username + "\nNew Username" + data.username
  );
});

app.post("/api/updateEmail", (req, res) => {
  //console.log("Updating a email now...");
  const data = req.body;
  uc.updateEmail(data.user, data.email);
  res.send("Old email: " + data.user.email + "\nNew email" + data.email);
});

app.post("/api/updatePassword", (req, res) => {
  //console.log("Updating a password now...");
  const data = req.body;
  uc.updatePassword(data.user, data.password);
  res.status(201).send();
});

app.post("/api/deleteUser", (req, res) => {
  //console.log("Deleting user...");
  const data = req.body;
  uc.deleteUser(data.user);
  res
    .status(201)
    .json({ message: "User has been successfully deleted", data: data.user });
});

app.listen(process.env.PORT, () => {
  //console.log(`The app has started on port ${process.env.PORT}`);
});
