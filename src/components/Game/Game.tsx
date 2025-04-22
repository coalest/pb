import React from "react";
import styles from "./Game.module.css";

import Ticker from "../Ticker/Ticker.tsx";
import Countdown from "../Countdown/Countdown.tsx";
import GameBox from "../GameBox/GameBox.tsx";

const Game: React.FC = () => {
  return (
    <div className={"game " + styles.game}>
      <Ticker refreshInterval={1000} crypto={"BTC"} initialPrice={0} />
      <Countdown duration={60} />
      <div className={styles.gameBoxes}>
        <GameBox gridArea="left-gamebox">Your bet</GameBox>
        <GameBox gridArea="center-gamebox">Locked price</GameBox>
        <GameBox gridArea="right-gamebox">Final price</GameBox>
      </div>
    </div>
  );
};

export default Game;
