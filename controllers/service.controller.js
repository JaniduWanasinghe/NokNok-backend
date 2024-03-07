import multer from "multer";
import * as path from "path"; // Import the path module
import { v4 as uuidv4 } from "uuid";
import Service from "../models/service.moel.js";
import createError from "../utils/createError.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import category from "../models/category.model.js";



// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = path.join(__dirname, "uploads");
    
//     // Create the "uploads" directory if it doesn't exist
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }

//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, 
// });
//export const uploadImagesMiddleware = upload.array("images", 3); // Allow up to 5 images, adjust as needed


export const createService = async (req, res, next) => {
 console.log(req.body)
 console.log(req.files);
console.log(req.Role);
  if (!req.body.role=='provider')
    return next(createError(403, "Only sellers can create a service!"));
    const { userId,title, desc, catid,images, cat, price, shortTitle, shortDesc,  } = req.body;
    const imageFileNames = req.files.map(file => file.filename);


    // if (!req.files || req.files.length === 0) {
    //   return next(createError(400, "At least one image is required!"));
    // }
    // uploadImagesMiddleware(req, res, (err) => {
    //   if (err) {
    //     return next(createError(400, err));
    //   }})

    // Extracting image file paths from the request
    // const images = req.files.map(file => file.path);
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

