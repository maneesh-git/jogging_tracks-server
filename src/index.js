require('./models/User');
require('./models/Track');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const requireAuth = require('./middlewares/requireAuth')
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

//  ADD username and password in the following mongodb URI
// Ideally we would do this in an environment file.

const mongoUri = 'mongodb://mongoUSERNAME:PASSWORD@cluster-shard-00-00-woydw.mongodb.net:27017,cluster-shard-00-01-woydw.mongodb.net:27017,cluster-shard-00-02-woydw.mongodb.net:27017/test?ssl=true&replicaSet=Cluster-shard-0&authSource=admin&retryWrites=true&w=majority';


//               mongodb+srv://mongoAdmin:<password>@cluster-woydw.mongodb.net/test?retryWrites=true&w=majority


//mongodb://<mongoUSERNAME>:<password>@cluster-shard-00-00-woydw.mongodb.net:27017,cluster-shard-00-01-woydw.mongodb.net:27017,cluster-shard-00-02-woydw.mongodb.net:27017/test?ssl=true&replicaSet=Cluster-shard-0&authSource=admin&retryWrites=true&w=majority


mongoose.connect(mongoUri, {
    useNewUrlParser : true,
    useCreateIndex : true
})

mongoose.connection.on('connected', () => {
    console.log("Connnected to mongo instance ....");
})

mongoose.connection.on('error', (err) => {
    console.error("Error on connecting to mongo\n",err);
})

app.get('/', requireAuth, (req, res) => {
    res.send(`Your email : ${req.user.email}`);
});

app.listen(3000, () => {
    console.log("Listening on port 3000 .......");
})

