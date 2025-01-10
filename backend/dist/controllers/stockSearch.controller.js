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
exports.searchStocks = void 0;
const listing_model_1 = require("../models/listing.model");
const searchStocks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticker = req.query.symbol;
    try {
        const listings = yield listing_model_1.Listing.aggregate([
            {
                $match: {
                    symbol: { $regex: `^${ticker}`, $options: 'i' }
                }
            },
            {
                $limit: 10
            }
        ]);
        res.status(200).json(listings);
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.searchStocks = searchStocks;
