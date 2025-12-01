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

let users = [];

io.on("connection", (socket) => {
  socket.on("joined", (user) => {
    users.push(user);
    console.log(users);
    io.emit("allUsers", users);
    io.emit("newJoin", user);
  });

  socket.on("leave", (u_id) => {
    users = users.filter((u) => u.unique_id !== u_id);
    io.emit("disconnect_user", users);
  });

  socket.on("change", (val) => {
    io.emit("newCode", val);
  })
});
