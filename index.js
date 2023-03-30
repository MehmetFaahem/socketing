const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();
const localPort = process.env.PORT;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const server = http.createServer(app);
const sock = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

sock.on("connection", (socket) => {
  console.log(`Someone here, his id ${socket.id}`);
  socket.on("messer", (data) => {
    console.log(data);
  });
  socket.on("disname", (data) => {
    socket.join(data);
    socket.to(data).emit("receive_message", {
      message: `someone has joined the chat room`,
      username: "BOT",
      __createdtime__: Date.now(),
    });

    console.log(data);
  });

  socket.emit("receive_message", {
    message: `Welcome in our group`,
    username: "BOT",
    __createdtime__: Date.now(),
  });

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
});

app.get("/", (req, res) => {
  res.json({ message: "got it" });
});

server.listen(localPort, () => {
  console.log(`The Server Is Running On ${localPort}`);
});
