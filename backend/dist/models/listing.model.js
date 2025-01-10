"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listing = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const listingSchema = new mongoose_1.default.Schema({
    symbol: { type: String },
    name: { type: String },
    exchange: { type: String },
    assetType: { type: Boolean },
    ipoDate: { type: String },
    delistingDate: { type: String },
    status: { type: String },
});
exports.Listing = mongoose_1.default.model('listing', listingSchema);
