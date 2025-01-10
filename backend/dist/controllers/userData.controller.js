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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = exports.removeExpense = exports.removeIncome = exports.addExpense = exports.addIncome = void 0;
const user_model_1 = require("../models/user.model");
const addIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const newData = new user_model_1.Transaction({
        date: req.body.date,
        amount: req.body.amount,
        name: req.body.name
    });
    try {
        const result = yield user_model_1.User.findByIdAndUpdate(userId, { $push: { income: newData } }, { new: true });
        res.status(200).json({ success: true, message: "Successfully saved" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.addIncome = addIncome;
const addExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const newData = new user_model_1.Transaction({
        date: req.body.date,
        amount: req.body.amount,
        name: req.body.name
    });
    try {
        const result = yield user_model_1.User.findByIdAndUpdate(userId, { $push: { expenses: newData } }, { new: true });
        res.status(200).json({ success: true, message: "Successfully saved" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.addExpense = addExpense;
const removeIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.body.transactionId;
    const userId = req.body.userId;
    try {
        const result = yield user_model_1.User.findByIdAndUpdate(userId, { $pull: { income: { _id: transactionId } } }, { new: true });
        res.status(200).json({ success: true, message: "Removed income record" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.removeIncome = removeIncome;
const removeExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.body.transactionId;
    const userId = req.body.userId;
    try {
        const result = yield user_model_1.User.findByIdAndUpdate(userId, { $pull: { expenses: { _id: transactionId } } }, { new: true });
        res.status(200).json({ success: true, message: "Removed expense record" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.removeExpense = removeExpense;
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    try {
        const result = yield user_model_1.User.findById(userId);
        if (result) {
            res.status(200).json(result.expenses.concat(result.income).sort((a, b) => b.date.getTime() - a.date.getTime()));
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getTransactions = getTransactions;
