//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const { userInfo } = require("os");
const mongoose=require("mongoose");
const { stringify } = require("querystring");
//const encrypt=require("mongoose-encryption");

const md5=require("md5");
const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/usersDB");

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

//userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});

const User= new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:md5(req.body.password)
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });

    
});

app.post("/login",function(req,res){
    const email=req.body.username;
    const pass=md5(req.body.password);

   User.findOne({email:email},function(err,foundUser){
    if(err){
        console.log(err)
    }else{
        if(foundUser){
            if(foundUser.password===pass){
                res.render("secrets");
            }
        }
    }
   })
})



app.listen(3000,function(){
    console.log("Server started on port 3000.");
});

