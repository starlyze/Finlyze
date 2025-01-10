"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stockSearch_controller_1 = require("../controllers/stockSearch.controller");
const router = express_1.default.Router();
router.get('/api/stocks/search', stockSearch_controller_1.searchStocks);
exports.default = router;
