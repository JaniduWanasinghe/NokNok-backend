import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import serviceRoute from "./routes/service.route.js";
import CategoryRoute from "./routes/category.route.js";
import conversationRoutes from "./routes/conversation.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";


const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

app.use(bodyParser.urlencoded({ extended: true }));

const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://sashika:Icanit11@cluster0.shsmmtd.mongodb.net/?retryWrites=true&w=majority");
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/service", serviceRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/conversations", conversationRoutes);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});

app.listen(8800, () => {
  connect();
  console.log("Backend server is running!");
});
