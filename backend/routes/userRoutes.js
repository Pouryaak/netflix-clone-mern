import express from "express";
import { updateUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/:id", protect, updateUser);

export default router;
