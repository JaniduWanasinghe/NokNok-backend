import express from "express";
import {
  createOrUpdateConversation,
  getConversation,
  deleteConversation,
  changeReadStatus,
} from "../controllers/conversation.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();


router.post("/", verifyToken, createOrUpdateConversation);


router.get("/", verifyToken, getConversation);

router.delete("/", verifyToken, deleteConversation);

router.patch("/change-read-status", verifyToken, changeReadStatus);

export default router;
