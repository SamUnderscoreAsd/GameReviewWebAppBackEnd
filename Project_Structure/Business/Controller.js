const express = require("express");
const app = express();
const userController = require("./Subsystems/UserController");
const User = require("./Models/User");
//This is the facade that will instruct the subsystems to act upon user request
var uc = new userController();

app.use(express.json());//important middleware function that parses request body data into a json which is a more usable form of data for our server
app.use(express.urlencoded());//another middleware function that allows your server to handle data from requests sending urlencoded data

app.get("/", (req, res) => {
  console.log("showing users");
  res.send(uc.DB.users);
});

app.post("/user", (req,res) =>{
  console.log("Gonna Create a user now...");
  const data = req.body;

  uc.createUser(new User("Sword105","testing","ethan@gmail.com"));
  res.status(201).json({message: 'User made successfully', data: data});
});

app.listen(3000, () => {
  console.log("The app has started on port 3000");
});

