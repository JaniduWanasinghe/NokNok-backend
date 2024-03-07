import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { io } from '../server.js'; // Adjust the path accordingly




export const register = async (req, res, next) => {
  try {
    const ImageName = req.file ? req.file.filename : '';

    const hash = bcrypt.hashSync(req.body.password, 5);
    const newUser = new User({
      ...req.body,
      img:ImageName,
      password: hash,
    });

    await newUser.save();
    res.status(201).send("User has been created.");
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      {
        id: user._id,
        role: user.Role,
      },
      process.env.JWT_KEY
    );
  
    res.cookie("accessToken", token);
    io.emit('notification', `${user.username} has logged in.`);

    const { password, ...info } = user._doc;
    console.log(token)
    res
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
export const toggleUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle the enable field
    if(user.enable==="true"){
      user.enable = "false";

    }
    else{
      user.enable = "true";

    }


    const updatedUser = await user.save();
console.log(updatedUser)
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

