import multer from "multer";
import * as path from "path"; // Import the path module
import { v4 as uuidv4 } from "uuid";
import Service from "../models/service.moel.js";
import createError from "../utils/createError.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import category from "../models/category.model.js";




export const createService = async (req, res, next) => {
 console.log(req.body)
 console.log(req.files);
console.log(req.Role);
  if (!req.body.role=='provider')
    return next(createError(403, "Only sellers can create a service!"));
    const { userId,title, desc, catid,images, cat, price, shortTitle, shortDesc,  } = req.body;
    const imageFileNames = req.files.map(file => file.filename);


 
  const newService =  new Service({
    userId: userId,
    title,
    desc,
    catid,
    cat,
    price,
    cover: req.files[0].filename,
    images:imageFileNames,
    shortTitle,
    shortDesc,

  });
  try {
    const savedService = await newService.save();
    await category.findByIdAndUpdate(catid, { $inc: { scount: 1 } });

    console.log(savedService);
    res.status(201).json(savedService);
  } catch (err) {
    next(err);
  }
};
export const deleteService = async (req, res, next) => {
  console.log({use:req.userId})
  try {
    const service = await Service.findById(req.params.id);
    console.log(service)
    if (service.userId !== req.userId)
      return next(createError(403, "You can delete only your service!"));

    await Service.findByIdAndDelete(req.params.id);
    res.status(200).send("Service has been deleted!");
  } catch (err) {
    next(err);
  }
};
export const getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) next(createError(404, "Service not found!"));
    res.status(200).send(service);
  } catch (err) {
    next(err);
  }
};
export const getServices = async (req, res, next) => {
  const q = req.query;
  console.log(q)
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { catid: q.cat }), // Corrected field name
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
  try {
    const services = await Service.find(filters).sort({ [q.sort]: -1 });
 // Corrected to log services, not Service
    res.status(200).send(services);
  } catch (err) {
    next(err);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const updateFields = {};
console.log(res.body)
    const { title, desc, catid, cat, price, shortTitle, shortDesc, deliveryTime } = req.body;
    if (title) updateFields.title = title;
    if (desc) updateFields.desc = desc;
    if (Array.isArray(catid) && catid.length > 0) {
      updateFields.catid = catid.map(String); // Convert each element to string
    } else if (catid) {
      // Handle single catid
      updateFields.catid = String(catid); // Convert to string
    }

    if (cat) updateFields.cat = cat;
    if (price) updateFields.price = price;
    if (req.files && req.files.length > 0) {
      updateFields.cover = req.files[0].filename;
      updateFields.images = req.files.map(file => file.filename);
    }
    if (shortTitle) updateFields.shortTitle = shortTitle;
    if (shortDesc) updateFields.shortDesc = shortDesc;
    if (deliveryTime) updateFields.deliveryTime = deliveryTime;

    const updatedService = await Service.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!updatedService) {
      return next(createError(404, "Service not found!"));
    }

    res.status(200).json(updatedService);
  } catch (err) {
    next(err);
  }
};
