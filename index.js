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
]

io.on("connection", function(socket){
    socket.on("createUser",function(myUsername){
        socket.myUsername = myUsername;
        usernames[myUsername] = myUsername;
        socket.currentRoom = "globalChat";

        socket.join("globalChat");
        socket.emit("updateChat", "INFO", "You have joined globalChat");
    })
    socket.on('sendMessage', function(message){
        io.sockets.to(socket.currentRoom).emit("updateChat", socket.username, message)
    })

    socket.on("updateRooms", function(room){
        socket.broadcast
        .to(socket.currentRoom)
        .emit("updateChat", "INFO", socket.username + " left room");

        socket.leave(socket.currentRoom);
        socket.currentRoom = room;
        socket.join(room);
        socket.emit("updateChat", "INFO", "You have joined "+ room);
        socket.broadcast
        .to(socket.currentRoom)
        .emit("updateChat", "INFO", socket.username + " has joined",+ room);
    })
});



server.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
});

