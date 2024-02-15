import { Server } from "socket.io";
import {createServer} from "http"
import  express from "express";
import path from "path";
import { v4 } from "uuid";

const app=express();
const server=createServer(app);
const io=new Server(server);

app.use(express.json())
app.set("view engine", "ejs");
app.set("views",path.resolve("./views"))

io.on("connection",(socket)=>{
   
  console.log(socket.id)
  socket.on('connectid', () => {
    console.log('Received connectid event from client');
    io.to(socket.id).emit('connectid', socket.id); 
  });
})
app.get("/",(req,res)=>{
    res.render("home")
})
app.get("/uuid",(req,res)=>{
    res.redirect("/"+v4())
})
app.get("/:roomId",(req,res)=>{
    res.render("room",{
        roomId:req.params.roomId
    })
})
app.listen(8000,()=>{
    console.log("listening on 8000")
})

