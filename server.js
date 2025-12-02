import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const port = 8080;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

server.listen(port, (req, res) => {
  console.log("listening to port 8080");
});

let rooms = new Map();

io.on("connection", (socket) => {
  socket.on("joined", (user) => {
    // get the room/meeting id
    let room_id = user.meeting_id;

    // check if that room exists
    if(!rooms.has(room_id)) {
      rooms.set(room_id, []);
    }

    // get users form the room
    let users = rooms.get(room_id);

    // add user
    users.push(user);

    // join the socket in the room
    socket.join(room_id);

    console.log(users);
    io.emit("allUsers", users);
    io.to(room_id).emit("newJoin", user);    
  });

  // socket.on("leave", (u_id) => {
  //   users = users.filter((u) => u.unique_id !== u_id);
  //   io.emit("disconnect_user", users);
  // });

  socket.on("change", ({room_id, val}) => {
    io.to(room_id).emit("newCode", val);
  })
});
