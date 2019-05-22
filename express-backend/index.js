const express = require("express");
const mongoose = require("mongoose");

const port = 4000;
const app = express();

const mongoDbConnectionString = "mongodb://localhost:27017/TaxiApp";

mongoose.connect(mongoDbConnectionString, {useNewUrlParser: true}).then(result => {
    console.log("Connected to database...");

    app.listen(port, () => {
        console.log("Server is runing on port: " + port);
    });
}).catch(error => {
    console.log(error);
});

app.get('/user', (req, res) => {
    res.send("You fetched user");
});


