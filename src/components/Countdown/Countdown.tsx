// import { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import styles from "./Countdown.module.css";

import { useGame } from "../../hooks/useGame";
import { useUser } from "../../hooks/useUser";

type CountdownProps = {
  duration: number;
};

const Countdown = ({ duration }: CountdownProps) => {
  const { countdownKey, isCountingDown, closeRound } = useGame();
  const { user } = useUser();

  return (
    <div className={styles.countdown}>
      <CountdownCircleTimer
        isPlaying={isCountingDown}
        key={countdownKey}
        rotation="clockwise"
        duration={duration}
        colors={"#004adf"}
        // colorsTime={[60, 2, 1, 0]}
        onComplete={() => {
          if (user !== null) {
            closeRound(user.id);
          }
        }}
      >
        {({ remainingTime }) => remainingTime}
      </CountdownCircleTimer>
    </div>
  );
};

export default Countdown;
