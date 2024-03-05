import express from "express";
import {
  createOrUpdateConversation,
  getConversation,
  deleteConversation,
  changeReadStatus,
  getAllConversationsForUser,
} from "../controllers/conversation.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();


router.post("/", verifyToken, createOrUpdateConversation);


router.get("/:id", verifyToken, getConversation);
router.get("/all/:userId", verifyToken, getAllConversationsForUser);


router.delete("/", verifyToken, deleteConversation);

router.patch("/change-read-status", verifyToken, changeReadStatus);

export default router;
