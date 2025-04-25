"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBitcoinPrice = void 0;
const axios_1 = __importDefault(require("axios"));
const fetchBitcoinPrice = async () => {
    const API_URL = "https://okx.com/api/v5/market/ticker?instId=BTC-USD-SWAP";
    try {
        const response = await axios_1.default.get(API_URL);
        const bitcoinPriceInCents = Math.round(Number.parseFloat(response.data.data[0].last) * 100);
        return bitcoinPriceInCents;
    }
    catch (err) {
        console.error("Error fetching Bitcoin price:", err);
        throw err;
    }
};
exports.fetchBitcoinPrice = fetchBitcoinPrice;
