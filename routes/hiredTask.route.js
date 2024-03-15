// routes/hiredTask.routes.js

import express from 'express';
import {
  createHiredTask,
  changeHiredTaskStatus,
  addReviewAndRating,
  updateHiredTaskPaymentStatus,
  getHiredTasksByUserId,
  getAllHiredTasks,
  paymentIntent,
  getAllCountsbyId,
  getHiredTasksByServiceId, // Import the new controller function
} from '../controllers/hiredTask.controller.js';
import { verifyToken } from '../middleware/jwt.js';

const router = express.Router();

// Create a hired task
router.post('/create', verifyToken, createHiredTask);

// Change hired task status
router.patch('/change-status/:id', verifyToken, changeHiredTaskStatus);

// Add review and rating to a hired task
router.post('/add-review/:id', verifyToken, addReviewAndRating);

// Update hired task payment status
router.patch('/update-payment-status/:taskId', verifyToken, updateHiredTaskPaymentStatus);

// Get all hired tasks related to a buyer or seller
router.get('/by-user/:userId', verifyToken, getHiredTasksByUserId);

// Get all hired tasks
router.get('/all', verifyToken, getAllHiredTasks);
router.get('/countbyid/:userId', verifyToken, getAllCountsbyId);

// New route for getting hired tasks by service ID
router.get('/by-service/:serviceId', verifyToken, getHiredTasksByServiceId);

router.post('/create-payment-intent', verifyToken, paymentIntent);

export default router;
