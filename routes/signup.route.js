const express = require('express');
const router = express.Router();

//importing db model
const User = require('../models/user.schema');

//imprting validation
const validSignUpInput = require('../validation/signup.validation');

//POST (Create)
router.post('/', (req,res) => {
    const data = req.body; 
    const { errors, isValid } = validSignUpInput(data);

    //handling errors
    if (!isValid) return (res.send(errors));
    
    //checking for existing user
    User.findOne({$or: [{ username: data.username }, { email: data.email }]})
    .then(user => {
        if(user){
            return res.json({
                error: "username or email already exists!!"
            })
        }
        else{
            var newUser = new User({
                username: data.username,
                email: data.email,
                password: data.password
            });
            //console.log(newUser)
        
            //saving to DB
            newUser.save()
            .then(user => {
                let { username, email, id } = user;
                let userData = {};
                userData.username = username
                userData.email = email
                userData.id = id
                res.status(200).json(userData);
            })
            .catch(err => {
                res.status(500).send(errors);
            })
        }
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

module.exports = router;