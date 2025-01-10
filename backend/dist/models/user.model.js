"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    amount: { type: Number, required: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
});
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    verified: { type: Boolean, default: false },
    authToken: { type: String },
    income: [transactionSchema],
    expenses: [transactionSchema],
});
exports.User = mongoose_1.default.model('User', userSchema);
exports.Transaction = mongoose_1.default.model('Transaction', transactionSchema);
