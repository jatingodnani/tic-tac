import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import path from "path";
import { v4 } from "uuid";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/uuid", (req, res) => {
  res.redirect("/" + v4());
});
app.get("/:roomId", (req, res) => {
  res.render("room", {
    roomId: req.params.roomId,
  });
});

io.on("connection", (socket) => {
  // ON CONNECTION
  console.log("A user connected", socket.id);
  // ON DISCONNECTION
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
  // JOINING ROOM
  socket.on("joinRoom", (roomId) => {
    console.log(`A user joined room : ${roomId}`);
    socket.join(roomId);
  });
  // SENDING MESSAGE
  socket.on("push", ({ roomId, boxStates }) => {
    console.log(boxStates);
    io.to(roomId).emit("pull", boxStates);
  });
});
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
