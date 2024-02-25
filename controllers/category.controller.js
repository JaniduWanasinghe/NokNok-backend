import Category from "../models/category.model.js";
import createError from "../utils/createError.js";

export const createCategory = async (req, res, next) => {
  if (!req.role=='admin')
    return next(createError(403, "Only sellers can create a service!"));

  const newCategory = new Category({
  
    ...req.body
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