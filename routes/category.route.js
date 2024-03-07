import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories
 
} from "../controllers/category.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set your desired upload folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

router.post("/", verifyToken,upload.single("cover"), createCategory);
router.get("/", getCategories);

router.delete("/:id", verifyToken, deleteCategory);


export default router;
