//jshint esversion:6
require("dotenv").config();              //IMPORTANT TO PUT THIS AT THE TOP OF YOUR CODE FILE
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secretSchema = new mongoose.Schema({
  secret: String
});

const Secret = new mongoose.model("Secret", secretSchema);

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
})

app.route("/login")

  .get(function(req, res){
    res.render("login")
  })


  .post(function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});

  app.route("/register")

    .get(function(req, res){
      res.render("register")
    })

    .post(function(req, res){

      const newUser = new User({
        email: req.body.username,
        password: req.body.password
      });

      newUser.save(function(err){
        if(err){
          console.log(err);
        }else{
          res.render("secrets");
        }
      });

    })

    // app.route("/logout")
    //
    // .get(function(req, res){
    //   res.redirect("/");
    // });
    //
    // app.route("/submit")
    //
    // .get(function(req, res){
    //   res.render("submit");
    // })
    //
    // .post(function(req, res){
    //   const newSecret = new Secret({
    //     secret: req.body.secret
    //   });
    //
    //   newSecret.save()
    //   res.render("secrets");
    // })

app.listen(3000, function(){
  console.log("Server running on port 3000");
});
