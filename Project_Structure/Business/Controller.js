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

app.post("/api/createUser", (req,res) =>{
  console.log("Gonna Create a user now...");
  const data = req.body;

  uc.createUser(new User(data.username, data.password, data.email))
  res.status(201).json({message: 'User made successfully', data: data});
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
  uc.updateUsername(data.user, data.password);
  res.send("Old password: " + data.user.password + "\nNew password" + data.password);
})

app.post("/api/deleteUser", (req,res)=>{
  console.log("Deleting user...");
  const data = req.body;
  uc.deleteUser(data.user);
  res.status(201).json({message: "User has been successfully deleted", data: data.user});
})

app.listen(3000, () => {
  console.log("The app has started on port 3000");
});

