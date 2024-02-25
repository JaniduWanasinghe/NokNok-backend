import express from "express";
import {
  createCategory,
  deleteCategory,
 
} from "../controllers/category.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createCategory);
router.delete("/:id", verifyToken, deleteCategory);


export default router;
