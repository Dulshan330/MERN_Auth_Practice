import express from "express";
import {
  checkAuth,
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check_auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify_email", verifyEmail);
router.post("/logout", logout);
router.post("/forgot_password", forgotPassword);
router.post("/reset_password/:token", resetPassword);

export default router;
