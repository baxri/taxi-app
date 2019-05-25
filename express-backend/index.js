const express = require("express");
const mongoose = require("mongoose");

const port = 4000;
const app = express();

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

        const user = new User();
        await user.save();

        res.send("User created!");
    });

}).catch(error => {
    console.log(error);
});





