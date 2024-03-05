import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import hiredTaskRoute from "./routes/hiredTask.route.js";

import serviceRoute from "./routes/service.route.js";
import CategoryRoute from "./routes/category.route.js";
import conversationRoutes from "./routes/conversation.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import { Server } from 'socket.io';
import http from 'http';
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import reportRoutes from './routes/report.route.js';



const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(cookieParser());
dotenv.config();
mongoose.set("strictQuery", true);


const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://sashika:Icanit11@cluster0.shsmmtd.mongodb.net/?retryWrites=true&w=majority");
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update with your React app's URL
    methods: ["GET", "POST"],
  },
});
let onlineUsers = [];

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};
console.log(onlineUsers)

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
    console.log(username)
  });

  socket.on("sendNotification", ({ senderName, receiverName, type }) => {
    const receiver = getUser(receiverName);
    console.log({"reciver":receiverName})
    if(receiver){
      io.to(receiver.socketId).emit("getNotification", {
        senderName,
        type,
      });
    }
 
  });

  socket.on("sendText", ({ senderName, receiverName, text }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getText", {
      senderName,
      text,
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authRoute);
app.use("/api/service", serviceRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/conversations", conversationRoutes);
app.use('/api/hired-tasks',hiredTaskRoute );
app.use('/api/report', reportRoutes);



app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});
export { io };

server.listen(8800, () => {
  connect();
  console.log("Backend server is running!");
});

