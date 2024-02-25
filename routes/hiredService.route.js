import express from "express";
import {
  hireService,
  getServiceDetails,
  changeStatus,
  addReview,
} from "../controllers/hiredService.controller.js"; // Adjust the path based on your project structure
import { verifyToken } from "../middleware/jwt.js"; // Assuming you have JWT middleware, adjust the path accordingly

const router = express.Router();

router.post("/hire", verifyToken, hireService);
router.get("/:hiredServiceId", verifyToken, getServiceDetails);
router.patch("/:hiredServiceId/change-status", verifyToken, changeStatus);
router.post("/:hiredServiceId/add-review", verifyToken, addReview);

export default router;
