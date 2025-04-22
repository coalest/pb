// import { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import styles from "./Countdown.module.css";

type CountdownProps = {
  duration: number;
};

const Countdown = ({ duration }: CountdownProps) => {
  const onComplete = () => console.log("Countdown completed!");

  return (
    <div className={styles.countdown}>
      <CountdownCircleTimer
        isPlaying
        rotation="clockwise"
        duration={duration}
        colors={"#004adf"}
        // colorsTime={[60, 2, 1, 0]}
        onComplete={onComplete}
      >
        {({ remainingTime }) => remainingTime}
      </CountdownCircleTimer>
    </div>
  );
};

export default Countdown;
