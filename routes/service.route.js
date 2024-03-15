import express from "express";
import {
  createService,
  deleteService,
  getService,
  getServices,
  updateService
} from "../controllers/service.controller.js";
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

router.post("/",upload.array('images'), createService);
router.delete("/:id", verifyToken, deleteService);

router.get("/single/:id", getService);
router.get("/",verifyToken, getServices);
router.put("/:id", verifyToken, upload.array('images'), updateService); 

export default router;
