import React from "react";
import styles from "./Game.module.css";

import Ticker from "../Ticker/Ticker.tsx";
import Countdown from "../Countdown/Countdown.tsx";
import GameBox from "../GameBox/GameBox.tsx";

import { useGame } from "../../hooks/useGame.tsx";

import { formatPriceInCents } from "../../utils/formatPrice.ts";

const Loading: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "180px",
        height: "180px",
      }}
    >
      <div style={{ placeSelf: "center", fontSize: "2rem" }}>Loading</div>
      <div
        className={styles.loader}
        style={{
          placeSelf: "center",
          marginLeft: "0.25rem",
          marginTop: "1rem",
        }}
      ></div>
    </div>
  );
};

const Game: React.FC = () => {
  const { prediction, lockedDirection, isLoading } = useGame();

  return (
    <div className={"game " + styles.game}>
      <Ticker refreshInterval={1000} crypto={"BTC"} initialPrice={0} />
      {isLoading && <Loading />}
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
