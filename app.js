//jshint esversion:6
const express=require("express");
const ejs=require("ejs");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
    extended: true

}));

mongoose.connect('mongodb://localhost:27017/usersDB', { useNewUrlParser: true, useUnifiedTopology: true, family: 4 });

const userSchema= new mongoose.Schema({
    email:String,
    password: String
});


const secret="thisismylittlesecretkey.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User=new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home")


})

app.get("/login", function(req, res){
    res.render("login")


})

app.get("/register", function(req, res){
    res.render("register")


})

app.post("/register", function(req,res){
    const newUser=new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save().then(result=>{
        res.render("secrets")
    }).catch(err=>{
        console.log(err)
    })
})

app.post("/login" , function(req, res){
    const username=req.body.username;
    const password=req.body.password;
     User.findOne({email: username}).then(function(foundUser){
        if(foundUser && foundUser.password===password){
            res.render("secrets");
        }
     })
     .catch(function(err){
        console.log(err);
        //handle any errors here
     })
})






app.listen(3000, function(){
    console.log("server started at server 3000.");
})
