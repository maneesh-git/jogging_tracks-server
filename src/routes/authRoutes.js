const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = new User({ email, password});
        await user.save();

        const token = jwt.sign({ userId : user._id}, 'MY_SECRET_KEY');

        res.send({ token });
    } catch(err) {
        return res.status(422).send(err.message); 
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;


    // Checking if email and password are present
    if(!email || !password) {
        return res.status(422).send({ error : 'Must provide email and password' });
    }

    // Finding the user in the Database with the email ID provided by the user
    const user = await User.findOne({ email : email });

    if(!user) {
        return res.status(422).send({ error : "Invalid email or password"});
    }

    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId : user._id }, 'MY_SECRET_KEY');
        res.send({ token });
    }
    catch (err) {
        return res.status(422).send({ error : "Invalid email or passsword"})
    }
    



});

module.exports = router;

/*
    The User model is how we interact with all the users that are stored inside of MongoDB

*/