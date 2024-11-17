import express from "express";
import {
  getApprovedGuides,
  getRequestedGuides,
  getUserProfile,
  grantGuidePermission,
  loginUser,
  registerUser,
  requestGuidePermission,
  revokeGuidePermission,
  updatedProfileDetails,
  uploadProfilePicture,
} from "../controllers/userController.js";
import { isAdmin, isUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", isUser, getUserProfile);
router.put("/update-profile", isUser, updatedProfileDetails);
router.put("/upload-profile", isUser, uploadProfilePicture);
router.post("/request-guide", isUser, requestGuidePermission);
router.post("/approve-guide/:id", isUser, isAdmin, grantGuidePermission);
router.post("/revoke-guide/:id", isUser, isAdmin, revokeGuidePermission);
router.get("/requested-guides", isUser, isAdmin, getRequestedGuides);
router.get("/approved-guides", isUser, isAdmin, getApprovedGuides);

export default router;
