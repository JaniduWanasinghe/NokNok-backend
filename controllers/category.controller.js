import Category from "../models/category.model.js";
import createError from "../utils/createError.js";

export const createCategory = async (req, res, next) => {
  if (!req.role=='admin'){
    return next(createError(403, "Only admin can create a service!"));

  }
const{title,desc}=req.body;
const coverImageName = req.file ? req.file.filename : '';

  const newCategory = new Category({
  title,
  desc,
scount:0,
  cover:coverImageName
  });

  try {
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  
  try {
    const service = await Category.findById(req.params.id);
    if (service.userId !== req.userId)
      return next(createError(403, "You can delete only your service!"));

    await Category.findByIdAndDelete(req.params.id);
    res.status(200).send("Category has been deleted!");
  } catch (err) {
    next(err);
  }
};
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};