const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const userRouter = require("./routes/users");

const port = 4000;
const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//Inject routes
app.use("/users", userRouter);

const mongoDbConnectionString = "mongodb://localhost:27017/TaxiApp";

mongoose.connect(mongoDbConnectionString, {useNewUrlParser: true}).then(result => {
    console.log("Connected to database...");

    app.listen(port, () => {
        console.log("Server is runing on port: " + port);
    });

}).catch(error => {
    console.log(error);
});





