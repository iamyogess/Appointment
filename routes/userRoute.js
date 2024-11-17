import express from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
  updatedProfileDetails,
  uploadProfilePicture,
} from "../controllers/userController.js";
import { isUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", isUser, getUserProfile);
router.put("/update-profile", isUser, updatedProfileDetails);
router.put("/upload-profile", isUser, uploadProfilePicture);

export default router;
