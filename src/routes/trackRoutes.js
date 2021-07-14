const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Track = mongoose.model('Track');

const router = express.Router();

router.use(requireAuth);
/* 
    all the request handlers that we attach to this router
    inside this file will require the user to sign in.

    And send in the token in the form of header.
    config : Authorization : "Bearer <token>"
*/


router.get('/tracks', async (req,res) => {
    console.log("Request in tracks :\n",req);
    const tracks = await Track.find({ userId : req.user._id });

    res.send(tracks);
})

router.post('/tracks', async (req,res) => {
    const { name, locations } = req.body;

    if(!name || !locations ) {
        return res
            .status(422)
            .send({ error : 'You must provide a name and locations'});
    }

    try {
        const track = new Track({ name, locations, userId : req.user._id });
        await track.save();
        res.send(track);
    } catch (err) {
        res.status(422).send({ error : err.message })
    }

})

module.exports = router;