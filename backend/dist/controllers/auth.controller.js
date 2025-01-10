"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserData = exports.googleCallback = exports.googleSignin = exports.changePassword = exports.forgotPassword = exports.signin = exports.verifyEmail = exports.sendVerificationEmail = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const validators_1 = require("../utils/validators");
const secrets_1 = require("../config/secrets");
const user_model_1 = require("../models/user.model");
const sendMail_1 = require("../utils/sendMail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
const verify_1 = __importDefault(require("../views/verify"));
const change_password_1 = __importDefault(require("../views/change-password"));
const saltRounds = 10;
const cookieConfig = {
    httpOnly: false,
    sameSite: "strict",
    secure: true,
    maxAge: 5 * 24 * 60 * 60 * 1000
};
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { valid, errors } = yield (0, validators_1.validateSignup)(req.body);
    if (!valid)
        return res.status(401).json({ message: 'Validation failed', errors });
    try {
        const hash = yield bcrypt_1.default.hash(req.body.password, saltRounds);
        const newUser = new user_model_1.User({
            username: req.body.username,
            email: req.body.email,
            password: hash
        });
        yield newUser.save();
        res.status(201).json({ message: 'Redirect to verify email' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error during sign-up', error: error.message });
    }
});
exports.signup = signup;
const sendVerificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findOne({ email: req.body.email });
        if (user) {
            if (user.verified)
                res.status(401).json({ message: 'Email is already verified' });
            const verificationToken = jsonwebtoken_1.default.sign({
                id: user.id,
                email: user.email,
            }, secrets_1.jwtSecret, { expiresIn: '1d' });
            user.authToken = verificationToken;
            yield user.save();
            const emailTemplate = (0, verify_1.default)(secrets_1.frontendURL, verificationToken);
            yield (0, sendMail_1.sendMail)(req.body.email, {
                subject: 'Finlyze email verification',
                html: emailTemplate
            });
            res.status(201).json({ message: 'Email successfully sent' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Invalid email address', error: error.message });
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(req.query.token, secrets_1.jwtSecret);
        const user = yield user_model_1.User.findById(decoded.id);
        if (!user)
            return res.status(404).json({ message: 'User not found.' });
        if (user.verified)
            return res.status(400).json({ message: 'User is already verified.' });
        else if (user.authToken !== req.query.token)
            return res.status(400).json({ message: 'Invalid token. Check your most recent email.' });
        user.verified = true;
        yield user.save();
        res.status(200).json({ message: 'Verification successful' });
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid or expired token.', error: error.message });
    }
});
exports.verifyEmail = verifyEmail;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, valid, errors } = yield (0, validators_1.validateSignin)(req.body);
    if (!valid)
        return res.status(401).json({ message: 'Validation failed', errors });
    try {
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            username: user.username,
        }, secrets_1.jwtSecret, { expiresIn: req.body.remember ? '10d' : '1d' });
        res.cookie('auth_jwt', token, cookieConfig);
        res.status(200).json({
            message: 'Logged in successfully.',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            }
        });
    }
    catch (error) {
        res.status(400).json({ message: 'Error during sign-in', error: error.message });
    }
});
exports.signin = signin;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, valid, errors } = yield (0, validators_1.validateForgotPassword)(req.body);
    if (!valid)
        return res.status(401).json({ message: 'Validation failed', errors });
    try {
        const forgotPasswordToken = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
        }, secrets_1.jwtSecret, { expiresIn: '1d' });
        user.authToken = forgotPasswordToken;
        yield user.save();
        const emailTemplate = (0, change_password_1.default)(secrets_1.frontendURL, forgotPasswordToken);
        yield (0, sendMail_1.sendMail)(req.body.email, {
            subject: 'Finlyze change password',
            html: emailTemplate,
        });
        res.status(201).json({ message: 'Request to change password sent.' });
    }
    catch (error) {
        res.status(400).json({ message: 'Internal server error', error: error.messsage });
    }
});
exports.forgotPassword = forgotPassword;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { valid, errors } = (0, validators_1.validateChangePassword)(req.body);
    if (!valid)
        return res.status(401).json({ message: 'Validation failed', errors });
    try {
        const decoded = jsonwebtoken_1.default.verify(req.query.token, secrets_1.jwtSecret);
        const user = yield user_model_1.User.findById(decoded.id);
        if (!user)
            return res.status(401).json({ message: 'User not found.' });
        if (user.authToken !== req.query.token)
            return res.status(401).json({ message: 'Invalid token. Check your most recent email.' });
        user.password = yield bcrypt_1.default.hash(req.body.password, saltRounds);
        user.verified = true;
        yield user.save();
        res.status(200).json({ message: 'Successfully changed password' });
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid request', error: "Token is invalid or expired" });
    }
});
exports.changePassword = changePassword;
const googleSignin = (req, res) => {
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');
    const oAuth2Client = new google_auth_library_1.OAuth2Client(secrets_1.googleAuthClientId, secrets_1.googleAuthClientSecret, secrets_1.googleAuthRedirectUri);
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile openid email',
        prompt: 'consent'
    });
    res.status(200).json({ url: authorizeUrl });
};
exports.googleSignin = googleSignin;
const googleCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    try {
        const oAuth2Client = new google_auth_library_1.OAuth2Client(secrets_1.googleAuthClientId, secrets_1.googleAuthClientSecret, secrets_1.googleAuthRedirectUri);
        const oAuthResponse = yield oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(oAuthResponse.tokens);
        const user = oAuth2Client.credentials;
        const userResponse = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            }
        });
        const userData = userResponse.data;
        const existingUser = yield user_model_1.User.findOne({ email: userData.email });
        if (existingUser) {
            const token = jsonwebtoken_1.default.sign({
                id: existingUser.id,
                email: existingUser.email,
                username: existingUser.username,
            }, secrets_1.jwtSecret, { expiresIn: '5d' });
            res.cookie('auth_jwt', token, cookieConfig);
            res.redirect(`${secrets_1.frontendURL}/dashboard`);
        }
        else {
            const newUser = new user_model_1.User({
                username: userData.name,
                email: userData.email,
            });
            yield newUser.save();
            const token = jsonwebtoken_1.default.sign({
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
            }, secrets_1.jwtSecret, { expiresIn: '5d' });
            res.cookie('auth_jwt', token, cookieConfig);
            res.redirect(`${secrets_1.frontendURL}/dashboard`);
        }
    }
    catch (error) {
        console.error(error);
        res.redirect(`${secrets_1.frontendURL}/signin`);
    }
});
exports.googleCallback = googleCallback;
const fetchUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secrets_1.jwtSecret);
        const user = yield user_model_1.User.findById(decoded.id);
        if (!user)
            res.status(401).json({ error: 'Invalid or expired token' });
        else
            res.status(200).json(decoded);
    }
    catch (error) {
        res.status(401).json({ error: error });
    }
});
exports.fetchUserData = fetchUserData;
