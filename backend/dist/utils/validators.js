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
exports.validateChangePassword = exports.validateForgotPassword = exports.validateSignin = exports.validateSignup = void 0;
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
const validateSignup = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = {};
    if (!data.username || typeof data.username !== 'string') {
        errors.username = 'Username is required and must be a string.';
    }
    else if (!usernameRegex.test(data.username)) {
        errors.username = 'Username must be between 3 and 20 characters and can only contain letters, numbers, dots, underscores, and hyphens.';
    }
    if (!data.email || typeof data.email !== 'string') {
        errors.email = 'Email is required and must be a string.';
    }
    else if (!emailRegex.test(data.email)) {
        errors.email = 'Invalid email format.';
    }
    else {
        try {
            const existingUser = yield user_model_1.User.findOne({ email: data.email });
            if (existingUser) {
                errors.email = "Email is already in use.";
            }
        }
        catch (error) {
            errors.server = "Internal Server Error";
        }
    }
    if (!data.password || typeof data.password !== 'string') {
        errors.password = 'Password is required and must be a string.';
    }
    else if (!passwordRegex.test(data.password)) {
        errors.password = 'Password must be at least 8 characters long and include at least one number.';
    }
    if (!data.confirmPassword || typeof data.confirmPassword !== 'string') {
        errors.confirmPassword = 'All input fields are required and must be strings.';
    }
    else if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords are not equal.';
    }
    return { valid: Object.keys(errors).length === 0, errors };
});
exports.validateSignup = validateSignup;
const validateSignin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = {};
    const result = {};
    if (!data.email || typeof data.email !== 'string') {
        errors.email = 'Email is required and must be a string.';
    }
    else if (!emailRegex.test(data.email)) {
        errors.email = 'Invalid email format.';
    }
    if (!data.password || typeof data.password !== 'string') {
        errors.password = 'Password is required and must be a string.';
    }
    else if (!errors.email) {
        try {
            result.user = yield user_model_1.User.findOne({ email: data.email });
            if (!result.user) {
                errors.email = "No account is registered with this email.";
            }
            else if (!result.user.password) {
                errors.email = "This account is signed in with Google.";
            }
            else if (!result.user.verified) {
                errors.verify = true;
            }
            else if (!result.user.password) {
                errors.email = "This account is already linked with google.";
            }
            else {
                const passwordsMatch = yield bcrypt_1.default.compare(data.password, result.user.password);
                if (!passwordsMatch)
                    errors.password = 'Passwords do not match.';
            }
        }
        catch (error) {
            errors.server = "Internal Server Error";
        }
    }
    result.valid = Object.keys(errors).length === 0;
    result.errors = errors;
    return result;
});
exports.validateSignin = validateSignin;
const validateForgotPassword = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = {};
    const result = {};
    if (!data.email || typeof data.email !== 'string') {
        errors.email = 'Email is required and must be a string.';
    }
    else if (!emailRegex.test(data.email)) {
        errors.email = 'Invalid email format.';
    }
    else {
        try {
            result.user = yield user_model_1.User.findOne({ email: data.email });
            if (!result.user)
                errors.email = "No account is registered with this email.";
        }
        catch (error) {
            errors.server = "Internal Server Error";
        }
    }
    result.valid = Object.keys(errors).length === 0;
    result.errors = errors;
    return result;
});
exports.validateForgotPassword = validateForgotPassword;
const validateChangePassword = (data) => {
    const errors = {};
    if (!data.password || typeof data.password !== 'string') {
        errors.password = 'Password is required and must be a string.';
    }
    else if (!passwordRegex.test(data.password)) {
        errors.password = 'Password must be at least 8 characters long and include at least one number.';
    }
    if (!data.confirmPassword || typeof data.confirmPassword !== 'string') {
        errors.confirmPassword = 'All input fields are required and must be strings.';
    }
    else if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords are not equal.';
    }
    return { valid: Object.keys(errors).length === 0, errors };
};
exports.validateChangePassword = validateChangePassword;
