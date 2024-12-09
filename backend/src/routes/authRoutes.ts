import express from "express";

import {
  signup,
  signin,
  verifyEmail,
  forgotPassword,
  changePassword,
  googleSignin,
  googleCallback
} from "../controllers/authController";

const router = express.Router();

router.post('/api/auth/signup', signup);
router.post('/api/auth/signin', signin);
router.get('/api/auth/verify-email', verifyEmail);
router.post('/api/auth/forgot-password', forgotPassword);
router.post('/api/auth/change-password', changePassword);
router.get('/api/auth/google', googleSignin);
router.get('/api/auth/google/callback', googleCallback);

export default router;
