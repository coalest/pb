import type { FC } from "react";
import styles from "./Game.module.css";

import Ticker from "../Ticker/Ticker.tsx";
import Countdown from "../Countdown/Countdown.tsx";
import GameBox from "../GameBox/GameBox.tsx";

import { useGame } from "../../hooks/useGame.tsx";

import { formatPriceInCents } from "../../utils/formatPrice.ts";

const LoadingDots: FC = () => <div className={styles.loader}></div>;

const Loader: FC = () => {
  return (
    <div style={{ display: "flex", width: "180px", height: "180px" }}>
      <div
        style={{ placeSelf: "center", fontSize: "1.5rem", textWrap: "nowrap" }}
      >
        Fetching price
      </div>
      <LoadingDots />
    </div>
  );
};

const Game: FC = () => {
  const { prediction, lockedDirection, isLoading } = useGame();

  const lockedPrice = prediction && formatPriceInCents(prediction.startPrice);
  const finalPrice =
    prediction?.finalPrice && formatPriceInCents(prediction.finalPrice);

  const Timer = () => {
    if (isLoading) {
      return <Loader />;
    } else {
      return <Countdown duration={60} />;
    }
  };

  return (
    <div className={"game " + styles.game}>
      <Ticker refreshInterval={1000} crypto={"BTC"} />
      <Timer />
      <div className={styles.gameBoxes}>
        <GameBox>
          <div>
            <h4>Your prediction</h4>
            <p>{lockedDirection}</p>
          </div>
        </GameBox>
        <GameBox>
          <div>
            <h4>Locked price</h4>
            <p>{lockedPrice}</p>
          </div>
        </GameBox>
        <GameBox>
          <div>
            <h4>Final price</h4>
            <p>{finalPrice}</p>
          </div>
        </GameBox>
      </div>
    </div>
  );
};

export default Game;
