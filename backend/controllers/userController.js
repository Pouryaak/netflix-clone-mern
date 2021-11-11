import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// @description Update user info
// @route POST /api/users/:id
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(updatedUser);
  } else {
    res.status(403);
    throw new Error("Not authorized to update this user");
  }
});

export { updateUser };
