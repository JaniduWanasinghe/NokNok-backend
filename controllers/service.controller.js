import multer from "multer";
import * as path from "path"; // Import the path module
import { v4 as uuidv4 } from "uuid";
import Service from "../models/service.moel.js";
import createError from "../utils/createError.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});
export const uploadImagesMiddleware = upload.array("images", 3); // Allow up to 5 images, adjust as needed


export const createService = async (req, res, next) => {
 
  if (!req.Role=='provider')
    return next(createError(403, "Only sellers can create a service!"));
    const { title, desc, catid, cat, price, shortTitle, shortDesc, deliveryTime } = req.body;
    res.status(201).json(req.body);

    // if (!req.files || req.files.length === 0) {
    //   return next(createError(400, "At least one image is required!"));
    // }
    uploadImagesMiddleware(req, res, (err) => {
      if (err) {
        return next(createError(400, "Error uploading images!"));
      }})

    // Extracting image file paths from the request
    const images = req.files.map(file => file.path);
  const newService =  new Service({
    userId: req.userId,
    title,
    desc,
    catid,
    cat,
    price,
    cover: images[0],
    images,
    shortTitle,
    shortDesc,
    deliveryTime,
  });
  try {
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (err) {
    next(err);
  }
};
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
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
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
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
    res.status(200).send(services);
  } catch (err) {
    next(err);
  }
};
