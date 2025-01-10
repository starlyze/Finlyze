"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
router.post('/api/auth/signup', auth_controller_1.signup);
router.post('/api/auth/signin', auth_controller_1.signin);
router.get('/api/auth/verify-email', auth_controller_1.verifyEmail);
router.post('/api/auth/forgot-password', auth_controller_1.forgotPassword);
router.post('/api/auth/change-password', auth_controller_1.changePassword);
router.post('/api/auth/verify-request', auth_controller_1.sendVerificationEmail);
router.get('/api/auth/google', auth_controller_1.googleSignin);
router.get('/api/auth/google/callback', auth_controller_1.googleCallback);
router.get('/api/auth/user', auth_controller_1.fetchUserData);
exports.default = router;
