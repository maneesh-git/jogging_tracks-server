const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    timestamp : Number,
    coords : {
        latitude: Number,
        longitude: Number,
        altitude : Number,
        accuracy : Number,
        heading : Number,
        speed : Number
    }
});

const trackSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name : {
        type: String,
        default: ''
    },
    locations : [pointSchema]
});

mongoose.model('Track', trackSchema);


/*
    userId in trackSchema 
    type : mongoose.Schema.Types.ObjectId,
    This  is how we reference to some other object inside of MongoDB.

    The ref property is used specifically by mongoose.
    It essentially  tells the userId is pointing at a instance of a User
    as was defined inside of User.js file.

    */