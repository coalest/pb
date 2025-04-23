// Using OKX API for BTC/USDT price stream
// See: https://www.okx.com/docs-v5/en/#overview-websocket
export const API_CONFIG = {
  USERS_ENDPOINT:
    "https://kdijn1nu4g.execute-api.eu-north-1.amazonaws.com/dev/users",
  PLACE_PREDICTION_ENDPOINT:
    "https://8f3eziiwfh.execute-api.eu-north-1.amazonaws.com/dev/predictions",
  WEBSOCKET_URI: "wss://ws.okx.com:8443/ws/v5/public",
  STORAGE_KEY: "userId",
};
