import express from 'express';
import {
  createHiredTask,
  changeHiredTaskStatus,
  addReviewAndRating,
  updateHiredTaskPaymentStatus,
  getHiredTasksByUserId,
  getAllHiredTasks,
  paymentIntent,
} from '../controllers/hiredTask.controller.js';
import { verifyToken } from "../middleware/jwt.js";
import stripe from 'stripe';
const stripeSecretKey = 'sk_test_51Oq7FJGxxBUoEIaM1mhVGT6CosxjWadPG96qxmqZZAGGfUCWxxje3sHbZjm2RaaXERkdqREDowobo5wGkRsPt7bI00B0o8YOnb';
const stripeClient = new stripe(stripeSecretKey);
const router = express.Router();

// Create a hired task
router.post('/create',verifyToken, createHiredTask);

// Change hired task status
router.patch('/change-status/:id',verifyToken, changeHiredTaskStatus);

// Add review and rating to a hired task
router.post('/add-review/:id',verifyToken, addReviewAndRating);

// Update hired task payment status
router.patch('/update-payment-status/:taskId',verifyToken, updateHiredTaskPaymentStatus);

// Get all hired tasks related to a buyer or seller
router.get('/by-user/:userId',verifyToken, getHiredTasksByUserId);

// Get all hired tasks
router.get('/all',verifyToken, getAllHiredTasks);
router.get('/test', async (req, res) => {
  return "test"
})
router.post('/create-payment-intent',verifyToken,paymentIntent );


export default router;
