const axios = require("axios");

async function fetchBitcoinPrice() {
  try {
    const response = await axios.get(
      "https://okx.com/api/v5/market/ticker?instId=BTC-USD-SWAP",
    );
    console.log(response.data.data[0]);

    const bitcoinPriceInCents = Math.round(
      Number.parseFloat(response.data.data[0].last, 10) * 100,
    );

    return bitcoinPriceInCents;
  } catch (err) {
    console.error("Error fetching Bitcoin price:", err);
    throw err;
  }
}

module.exports = { fetchBitcoinPrice };
