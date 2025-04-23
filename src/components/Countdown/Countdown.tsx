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
  const onComplete = () => {
    if (user !== null) closeRound(user?.id);
  };

  return (
    <div className={styles.countdown}>
      <CountdownCircleTimer
        isPlaying={isCountingDown}
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
