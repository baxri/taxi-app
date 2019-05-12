const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 3000;

let taxiSocket = null;

io.on("connection", socket => {
    console.log("User connected :D")

    socket.on("taxiRequest", routeResponse => {
        if (taxiSocket) {
            console.log('Send response to taxi!')
            taxiSocket.emit("taxiRequest", routeResponse);
        }
    });
    socket.on("lookingForPassengers", () => {
        console.log("lookingForPassengers");
        taxiSocket = socket;
    });
});


server.listen(port, () => console.log("Server running on port: " + port));
