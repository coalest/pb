import WebSocket from "ws";

const ws = new WebSocket("wss://ws.okx.com:8443/ws/v5/public");

ws.on("open", () => {
  console.log("Connected to OKX WebSocket");

  const subscribeMsg = {
    op: "subscribe",
    args: [
      {
        channel: "tickers",
        instId: "BTC-USDT",
      },
    ],
  };

  ws.send(JSON.stringify(subscribeMsg));
});

ws.on("message", (data) => {
  const parsed = JSON.parse(data);

  if (parsed.arg && parsed.arg.channel === "tickers" && parsed.data) {
    const ticker = parsed.data[0];
    console.log(`BTC/USDT Price: ${ticker.last}`);
  }
});

ws.on("error", (error) => {
  console.error("WebSocket error:", error);
});

ws.on("close", () => {
  console.log("WebSocket connection closed");
});
