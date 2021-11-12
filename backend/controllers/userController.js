import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// @description Update user info
// @route POST /api/users/:id
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const user = User.findById(req.params.id);

  if (req.user._id.toString() === req.params.id || req.user.isAdmin) {
    if (user) {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      ).select("-password");
      res.send(updatedUser);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } else {
    res.status(403);
    throw new Error("Not authorized to update this user");
  }
});

// @description Update user info
// @route DELETE /api/users/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id || req.user.isAdmin) {
    const user = await User.findById(req.params.id);

    if (user) {
      await User.deleteOne({ _id: req.params.id });
      res.json({ message: "User has been deleted!" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } else {
    res.status(403);
    throw new Error("Not authorized to delete this user");
  }
});

// @description Find user info by ID
// @route GET /api/users/find/:id
// @access Private
const findUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id || req.user.isAdmin) {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } else {
    res.status(403);
    throw new Error("Not authorized to view this user");
  }
});

// @description Get all users info
// @route GET /api/users/
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const query = req.query.new;

  if (req.user.isAdmin) {
    const users = query
      ? await User.find().sort({ createdAt: "desc" }).limit(10)
      : await User.find();
    res.json(users);
  } else {
    res.status(403);
    throw new Error("Not authorized to view all user");
  }
});

// @description Get total number of users per month
// @route GET /api/users/stats
// @access Private
const getUsersStats = asyncHandler(async (req, res) => {
  if (req.user.isAdmin) {
    const today = new Date();
    // const lastYear = today.setFullYear(today.setFullYear() - 1);

    // const months = [
    //   "January",
    //   "February",
    //   "March",
    //   "April",
    //   "May",
    //   "June",
    //   "July",
    //   "August",
    //   "September",
    //   "October",
    //   "November",
    //   "December",
    // ];

    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    res.json(data);
  } else {
    res.status(403);
    throw new Error("Not authorized to view all users stats");
  }
});

export { updateUser, deleteUser, findUser, getAllUsers, getUsersStats };
