import createError from "http-errors";
import HiredService from "../models/hiredService.model"; // Adjust the path based on your project structure
import Service from "../models/service.model"; // Assuming you have a Service model, adjust the path accordingly

export const hireService = async (req, res, next) => {
  try {
    const { serviceId, userId, noHours, Total,desc,title } = req.body;

    // Validate if the service exists
    const service = await Service.findById(serviceId);
  
    if (!service) {
      return next(createError(404, "Service not found"));
    }
    const{providerId}=service

    // Create a new hired service
    const hiredService = new HiredService({
      serviceId,
      providerId,
      userId,
      title,
      desc,
      noHours,
      Total,
    });

    const savedHiredService = await hiredService.save();

    res.status(201).json(savedHiredService);
  } catch (err) {
    next(err);
  }
};

export const getServiceDetails = async (req, res, next) => {
  try {
    const { hiredServiceId } = req.params;

    // Validate if the hired service exists
    const hiredService = await HiredService.findById(hiredServiceId);
    if (!hiredService) {
      return next(createError(404, "Hired service not found"));
    }

    res.status(200).json(hiredService);
  } catch (err) {
    next(err);
  }
};

export const changeStatus = async (req, res, next) => {
  try {
    const { hiredServiceId } = req.params;
    const { status } = req.body;

    // Validate if the hired service exists
    const hiredService = await HiredService.findById(hiredServiceId);
    if (!hiredService) {
      return next(createError(404, "Hired service not found"));
    }

    // Update the status
    hiredService.status = status;
    const updatedHiredService = await hiredService.save();

    res.status(200).json(updatedHiredService);
  } catch (err) {
    next(err);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { hiredServiceId } = req.params;
    const { rating, review } = req.body;

    // Validate if the hired service exists
    const hiredService = await HiredService.findById(hiredServiceId);
    if (!hiredService) {
      return next(createError(404, "Hired service not found"));
    }

    // Update the rating and review
    hiredService.rating = rating;
    hiredService.review = review;
    const updatedHiredService = await hiredService.save();

    res.status(200).json(updatedHiredService);
  } catch (err) {
    next(err);
  }
};
