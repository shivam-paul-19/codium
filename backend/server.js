import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const port = 8080;

app.use(
  cors({
    origin: "*",
  })
);

app.get("/test", (req, res) => {
  res.send("CI/CD perfect!");
})

export { app, server, io };

if (process.env.NODE_ENV !== "test") {
  server.listen(port, (req, res) => {
    console.log("listening to port 8080");
  });
}

let rooms = new Map();
let room_content = new Map();

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

    user = {
      ...user,
      userColor: Math.floor(Math.random() * 5)
    }

    // add user
    users.push(user);

    // join the socket in the room
    socket.join(room_id);

    if(room_content.has(room_id)) {
      socket.emit("getContent", room_content.get(room_id));
    }

    io.to(room_id).emit("allUsers", users);
    io.to(room_id).emit("newJoin", user);    
  });

  socket.on("leave", ({u_id, room_id}) => {
    if(!rooms.has(room_id)) return;

    let users = rooms.get(room_id).filter((u) => u.unique_id !== u_id);

    if (users.length === 0) {
      rooms.delete(room_id);   // Remove entire room
      room_content.delete(room_id);
    } else {
      rooms.set(room_id, users);
    }

    io.to(room_id).emit("disconnect_user", users);
    socket.leave(room_id);
  });

  socket.on("change", ({room_id, val}) => {
    if(!room_content.has(room_id)) {
      room_content.set(room_id, "");
    }

    room_content.set(room_id, val);
    socket.to(room_id).emit("newCode", val);
  })
})
