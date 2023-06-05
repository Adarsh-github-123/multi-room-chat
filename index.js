const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 4000;

app.use(express.static('public'));

const usernames = {};
const rooms = [
    {name: "globalChat", creator: "anonymous"},
    {name: "chess", creator: "anonymous"},
    {name: "javascript", creator: "anonymous"},
];

io.on("connection", function(socket){
    socket.on("createUser",function(myUsername){
        socket.myUsername = myUsername;
        usernames[myUsername] = myUsername;
        socket.currentRoom = "globalChat";

        socket.join("globalChat");
        socket.emit("updateChat", "INFO", "You have joined globalChat");
    })
})

server.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
})