import HiredTask from "../models/hiredTask.model.js";
import Service from "../models/service.moel.js";
import stripe from 'stripe';
const stripeSecretKey = 'sk_test_51Oq7FJGxxBUoEIaM1mhVGT6CosxjWadPG96qxmqZZAGGfUCWxxje3sHbZjm2RaaXERkdqREDowobo5wGkRsPt7bI00B0o8YOnb';
const stripeClient = new stripe(stripeSecretKey);

export const createHiredTask = async (req, res, next) => {
  try {
    const {
      location,
      hours,
      message,
      user,
      service,
      total
    } = req.body;
const serviceId=service._id;
const title=service.title;
const sellerId=service.userId;
const buyerId=user._id;
const rate=service.price;
const cover=service.cover;
    const hiredTask = new HiredTask({
      sellerId,
      buyerId,
      title,
      note:message,
      location,
      serviceId,
      total:total,
      cover,
      rate,
      hours      
    });

    const savedHiredTask = await hiredTask.save();

    // Increment sales count for the related service
    await Service.findByIdAndUpdate(serviceId, { $inc: { sales: 1 } });

    res.status(201).json(savedHiredTask);
  } catch (error) {
    next(error);
  }
};

export const changeHiredTaskStatus = async (req, res, next) => {
    try {
      const hiredTaskId = req.params.id;
      const { status } = req.body;
  
      const updatedHiredTask = await HiredTask.findByIdAndUpdate(
        hiredTaskId,
        { status },
        { new: true }
      );
  
      if (!updatedHiredTask) {
        return res.status(404).json({ message: "Hired task not found" });
      }
  
      res.status(200).json(updatedHiredTask);
    } catch (error) {
      next(error);
    }
  };
  export const addReviewAndRating = async (req, res, next) => {
    try {
      const hiredTaskId = req.params.id;
      const { reviews, totalStars } = req.body;
  
      const updatedHiredTask = await HiredTask.findByIdAndUpdate(
        hiredTaskId,
        { reviews, totalStars },
        { new: true }
      );
  
      if (!updatedHiredTask) {
        return res.status(404).json({ message: "Hired task not found" });
      }
  
      res.status(200).json(updatedHiredTask);
    } catch (error) {
      next(error);
    }
  };
  export const updateHiredTaskPaymentStatus = async (req, res, next) => {
    try {
      const { taskId } = req.params;
      const { newPaymentStatus } = req.body;
  
      const updatedHiredTask = await HiredTask.findByIdAndUpdate(
        taskId,
        { payment: newPaymentStatus },
        { new: true }
      );
  
      res.status(200).json(updatedHiredTask);
    } catch (err) {
      next(err);
    }
  };
  // Controller to get all hired tasks related to a buyer or seller
export const getHiredTasksByUserId = async (req, res, next) => {
    try {
      const { userId } = req.params;
  
      // Find hired tasks where either buyerId or sellerId matches the provided user ID
      const hiredTasks = await HiredTask.find({
        $or: [{ buyerId: userId }, { sellerId: userId }],
      });
  
      res.status(200).json(hiredTasks);
    } catch (err) {
      next(err);
    }
  };
  export const getAllHiredTasks = async (req, res, next) => {
    try {
      const hiredTasks = await HiredTask.find();
      res.status(200).json(hiredTasks);
    } catch (err) {
      next(err);
    }
  };
  export const paymentIntent=async (req, res) => {
  const total=req.body.total;
    try {
  console.log("recived")
      // Create a PaymentIntent with the specified amount
      const paymentIntent = await stripeClient.paymentIntents.create({
        amount:total*100,
        currency: 'usd',
      });
  
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating payment intent');
    }
  }

  export const getAllCounts = async (req, res, next) => {
    try {
      const allServicesCount = await Service.countDocuments({});
      const pendingServicesCount = await HiredTask.countDocuments({ status: 'pending' });
      const processingServicesCount = await HiredTask.countDocuments({ status: 'processing' });
      const acceptedServicesCount = await HiredTask.countDocuments({ status: 'accepted' });
      const doneServicesCount = await HiredTask.countDocuments({ status: 'done' });
  
      res.status(200).json({
        allServicesCount,
        pendingServicesCount,
        processingServicesCount,
        acceptedServicesCount,
        doneServicesCount,
      });
    } catch (err) {
      next(err);
    }
  };

  export const getAllCountsbyId = async (req, res, next) => {
    try {
      const userId = req.params.userId;
  
      const allServicesCount = await HiredTask.countDocuments({
        $or: [{ buyerId: userId }, { sellerId: userId }]
      });
      const userPendingServicesCount = await HiredTask.countDocuments({
        $or: [{ buyerId: userId, status: 'pending' }, { sellerId: userId, status: 'pending' }]
      });
      const userProcessingServicesCount = await HiredTask.countDocuments({
        $or: [{ buyerId: userId, status: 'processing' }, { sellerId: userId, status: 'processing' }]
      });
      const userAcceptedServicesCount = await HiredTask.countDocuments({
        $or: [{ buyerId: userId, status: 'accepted' }, { sellerId: userId, status: 'accepted' }]
      });
      const userDoneServicesCount = await HiredTask.countDocuments({
        $or: [{ buyerId: userId, status: 'done' }, { sellerId: userId, status: 'done' }]
      });
  
      res.status(200).json({
        allServicesCount,
        userPendingServicesCount,
        userProcessingServicesCount,
        userAcceptedServicesCount,
        userDoneServicesCount,
      });
    } catch (err) {
      next(err);
    }
  };
  