const express = require("express");
const cors = require('cors');
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2');
const userController = require("./Subsystems/UserController");
const User = require("./Models/User");
const IGDBToken = require('./Subsystems/IGDBToken');
const PORT = 3001
//This is the facade that will instruct the subsystems to act upon user request
var uc = new userController();

//TODO UPDATE ENDPOINT NAMES TO BE RESTFUL API
//use noun based naming ask gpt

require('./Subsystems/auth');

app.use(express.json());//important middleware function that parses request body data into a json which is a more usable form of data for our server

app.use(express.urlencoded());//another middleware function that allows your server to handle data from requests sending urlencoded 

app.use(cors({//cors package basically allows the server to specify from where its expecting a request from. its a browser protocol to prevent malicious actors from 
  //being able to send requests from outside the intended locations.

   origin: "*",//origin is set to all, this is a vulnerability, but allows me to continue developing and later deal with the consequences

  credentials: true 
}));

// const token = new IGDBToken(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_CLIENT_SECRET);
// token.getValidToken().then(()=>{
//   token.getRandomGames().then(results => {
//     console.log(results);
//   })
// });

app.get("/", (req,res) =>{
  var isTrue = uc.authenticateUser(new User("JohnCarlos2012", "panasonicFIUaustin"));

  res.send('<a href="/auth/google">Authenticate with Google</a>');
})

app.post('/api/login',async (req,res) =>{
  isAuthenticated = false
  try {
    const data = req.body;
    await uc.authenticateUser(data.user)
    .then(isMatch =>{
      res.status(201).send(isMatch);
    });

  } catch (err) {
    console.error(err);
  }
});

app.post("/api/getUser", (req, res) => {
  const data = req.body;
  uc.getUser(data.user).then(retrievedData => {
    // res.send(retrievedData);
    res.status(201).send(retrievedData);
  });
});

app.post("/api/createUser", (req,res) =>{
  console.log("Gonna Create a user now...");
  const data = req.body;

  uc.createUser(new User(data.user.username, data.user.password, data.user.email))
  res.status(201).json({message: 'User made successfully', data: data});
  res.redirect('http://localhost:3000/')
});

app.post("/api/updateUsername", (req,res) =>{
  console.log("Updating a user now...");
  const data = req.body; 
  uc.updateUsername(data.user, data.username);
  res.send("Old username: " + data.user.username + "\nNew Username" + data.username);
})

app.post("/api/updateEmail", (req,res) =>{
  console.log("Updating a email now...");
  const data = req.body;
  uc.updateEmail(data.user, data.email);
  res.send("Old email: " + data.user.email + "\nNew email" + data.email);
})

app.post("/api/updatePassword", (req,res) =>{
  console.log("Updating a password now...");
  const data = req.body;
  uc.updatePassword(data.user, data.password);
  res.send("Old password: " + data.user.password + "\nNew password" + data.password);
})

app.post("/api/deleteUser", (req,res)=>{
  console.log("Deleting user...");
  const data = req.body;
  uc.deleteUser(data.user);
  res.status(201).json({message: "User has been successfully deleted", data: data.user});
})




app.listen(PORT, () => {
  console.log(`The app has started on port ${PORT}`);
});

