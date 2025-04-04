require("dotenv").config();
const express=require("express");
const cors= require("cors");
const http=require("http");
const connectDB= require("./config/db");
const {Server}=require("socket.io");


const authRoutes=require("./routes/authRoutes");
const chatRoutes=require("./routes/chatRoutes");
const chatRoomRoutes= require("./routes/chatRoomRoutes");

connectDB();

const app= express();
const server=http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chatroom", chatRoomRoutes);

const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
require("./socket/socket")(io);  

const PORT= process.env.PORT || 5000;

server.listen(PORT, ()=> console.log(`Server is running on the port no. ${PORT}.`));

  

