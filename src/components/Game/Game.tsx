import React from "react";
import styles from "./Game.module.css";

import Ticker from "../Ticker/Ticker.tsx";
import Countdown from "../Countdown/Countdown.tsx";
import GameBox from "../GameBox/GameBox.tsx";

import { useGame } from "../../hooks/useGame.tsx";

import { formatPriceInCents } from "../../utils/formatPrice.ts";

const LoadingDots: React.FC = () => <div className={styles.loader}></div>;

const Loader: React.FC = () => {
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

const Game: React.FC = () => {
  const { prediction, lockedDirection, isLoading } = useGame();

  return (
    <div className={"game " + styles.game}>
      <Ticker refreshInterval={1000} crypto={"BTC"} />
      {isLoading && <Loader />}
      {!isLoading && <Countdown duration={60} />}
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
            <p>{prediction && formatPriceInCents(prediction.startPrice)}</p>
          </div>
        </GameBox>
        <GameBox>
          <div>
            <h4>Final price</h4>
            <p>
              {prediction?.finalPrice &&
                formatPriceInCents(prediction.finalPrice)}
            </p>
          </div>
        </GameBox>
      </div>
    </div>
  );
};

export default Game;
