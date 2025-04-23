import { useEffect, useState, type FC } from "react";
import styles from "./Ticker.module.css";

import BitcoinLogo from "../BitcoinLogo/BitcoinLogo";
import Arrow from "../Arrow/Arrow";
import { formatPrice } from "../../utils/formatPrice";

import { API_CONFIG } from "../../config/api";

interface TickerProps {
  crypto: string;
  refreshInterval: number;
}

const Ticker: FC<TickerProps> = ({
  crypto = "BTC",
  refreshInterval = 1000,
}) => {
  const [tickerPrice, setTickerPrice] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  let ws: WebSocket | null = null;

  useEffect(() => {
    const connectWebSocket = () => {
      ws = new WebSocket(API_CONFIG.WEBSOCKET_URI);

      const subscribe = {
        op: "subscribe",
        args: [
          {
            channel: "tickers",
            instId: `${crypto}-USDT`,
          },
        ],
      };

      ws.onopen = () => {
        console.log("Connected to OKX Ticker WebSocket");

        ws?.send(JSON.stringify(subscribe));

        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.arg && data.arg.channel === "tickers" && data.data) {
            const newPrice: number = parseFloat(data.data[0].last);
            setTickerPrice(newPrice);
          }
        } catch (err) {
          console.error("Error parsing WebSocket data:", err);
        }
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", event);

        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");

        setIsConnected(false);

        setTimeout(() => {
          if (ws?.readyState === WebSocket.CLOSED) {
            connectWebSocket();
          }
        }, refreshInterval);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) ws.close();
    };
  }, [refreshInterval, crypto]);

  const TickerPrice: FC = () => {
    return (
      <div className="price" style={{ display: "inline", fontSize: "5rem" }}>
        {tickerPrice && formatPrice(tickerPrice)}
      </div>
    );
  };

  return (
    <div className={styles.ticker}>
      <div className={styles.tickerPrice}>
        <BitcoinLogo className={styles.bitcoinLogo} />
        <TickerPrice />
        <div style={{ display: "inline-flex", flexDirection: "column" }}>
          <Arrow className={styles.upArrow} />
          <Arrow className={styles.downArrow} />
        </div>
      </div>
      {isConnected && (
        <div style={{ textAlign: "center" }}>Live Bitcoin price</div>
      )}
    </div>
  );
};

export default Ticker;
