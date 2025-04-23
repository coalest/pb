import { CountdownCircleTimer } from "react-countdown-circle-timer";
import styles from "./Countdown.module.css";

import { useGame } from "../../hooks/useGame";

type CountdownProps = {
  duration: number;
  timeLeft: number;
};

const Countdown = ({ duration, timeLeft }: CountdownProps) => {
  const { user, countdownKey, isCountingDown, closeRound } = useGame();
  const onComplete = () => {
    if (user !== null) closeRound(user.id);
  };

  return (
    <div className={styles.countdown}>
      <CountdownCircleTimer
        isPlaying={isCountingDown}
        initialRemainingTime={timeLeft}
        key={countdownKey}
        rotation="clockwise"
        duration={duration}
        colors={["#004adf", "#ee4b2b"]}
        colorsTime={[60, 10, 0]}
        isSmoothColorTransition={false}
        onComplete={onComplete}
      >
        {({ remainingTime }) => remainingTime}
      </CountdownCircleTimer>
    </div>
  );
};

export default Countdown;
