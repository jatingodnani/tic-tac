// server.js
import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.resolve("/public")));
app.set("view engine", "ejs");

io.on("connect", (socket) => {
    console.log(`A user connected with ID: ${socket.id}`);
   socket.on('join-room',roomId=>{
    let room=io.sockets.adapter.rooms.get(roomId);
    let roomSize=0;
    if(room){
        roomSize=room.size
    }
    if(roomSize<2){
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-connected");
        socket.on("disconnect",()=>{
            socket.broadcast.to(roomId).emit("user-disconnected");
        })
        socket.on('can-play',()=>{
            socket.broadcast.to(roomId).emit("can-play");
    
        })
    
        socket.on("clicked",(id)=>{
            socket.broadcast.to(roomId).emit("clicked",id);
        })
       
    }else{
        socket.emit('full-room');
    }

  
   })
    
});

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/uuid", (req, res) => {
    res.redirect("/" + uuidv4());
});

app.get("/:roomId", (req, res) => {
    res.render("room", {
        roomId: req.params.roomId
    });
});

server.listen(8000, () => {
    console.log("Server listening on port 8000");
});
