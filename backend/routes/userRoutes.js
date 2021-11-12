import express from "express";
import {
  updateUser,
  deleteUser,
  findUser,
  getAllUsers,
  getUsersStats,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllUsers);
router.get("/stats", protect, getUsersStats);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);
router.get("/find/:id", protect, findUser);

export default router;
