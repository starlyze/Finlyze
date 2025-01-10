"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userData_controller_1 = require("../controllers/userData.controller");
const router = express_1.default.Router();
router.post('/api/transactions/expense', userData_controller_1.addExpense);
router.delete('/api/transactions/expense', userData_controller_1.removeExpense);
router.post('/api/transactions/income', userData_controller_1.addIncome);
router.delete('/api/transactions/income', userData_controller_1.removeIncome);
router.post('/api/transactions', userData_controller_1.getTransactions);
exports.default = router;
