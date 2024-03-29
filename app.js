//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


const app = express();

console.log(process.env.API_KEY);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// Ending Prerequisites

// Mongoose.connect
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


// Encryption
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
// End Encryption

const User = new mongoose.model('User', userSchema);
// End of Mongoose.connect


// Starting Routes
app.get('/', function(req, res){
    res.render('home');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/register', function(req, res){
    res.render('register');
});

// Posting Registration to the database
app.post('/register', function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        } else {
            res.render('secrets');
        }
    });
})

// Posting/Checking Login to the database
app.post('/login', function(req, res){
    const username = req.body.username;
    const password = req.body.password;


    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                if(foundUser.password === password){
                    res.render('secrets');
                }
            }
        }
    });
});











app.listen(3000, function() {
    console.log('Server started on port 3000');
});