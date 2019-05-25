const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const port = 4000;
const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const User = require("./models/User");

const mongoDbConnectionString = "mongodb://localhost:27017/TaxiApp";

mongoose.connect(mongoDbConnectionString, {useNewUrlParser: true}).then(result => {
    console.log("Connected to database...");

    app.listen(port, () => {
        console.log("Server is runing on port: " + port);
    });

    app.get('/user', (req, res) => {
        res.send("You fetched user");
    });

    app.post('/user', async (req, res) => {
        try {
            const user = new User(req.body);
            await user.save();
            res.json(user);
        } catch (err) {
            res.json(err);
        }
    });

}).catch(error => {
    console.log(error);
});





