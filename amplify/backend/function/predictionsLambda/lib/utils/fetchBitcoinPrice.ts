import axios from "axios";

export const fetchBitcoinPrice = async () => {
  const API_URL = "https://okx.com/api/v5/market/ticker?instId=BTC-USD-SWAP";

  try {
    const response = await axios.get(API_URL);

    const bitcoinPriceInCents = Math.round(
      Number.parseFloat(response.data.data[0].last) * 100,
    );

    return bitcoinPriceInCents;
  } catch (err) {
    console.error("Error fetching Bitcoin price:", err);
    throw err;
  }
};
