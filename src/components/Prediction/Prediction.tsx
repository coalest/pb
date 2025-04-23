import { type FC } from "react";

import styles from "./Prediction.module.css";

import Arrow from "../Arrow/Arrow.tsx";
import Button from "../Button/Button.tsx";
import Tutorial from "../Tutorial/Tutorial.tsx";

import { useGame } from "../../hooks/useGame";

import { PredictionDirection } from "../../shared.types.ts";

const Prediction: FC = () => {
  const {
    user,
    currentDirection,
    updateCurrentDirection,
    placeNewPrediction,
    lockedDirection,
  } = useGame();

  const upButtonStyles =
    currentDirection === PredictionDirection.UP
      ? `${styles.upButton} ${styles.active}`
      : styles.upButton;

  const downButtonStyles =
    currentDirection === PredictionDirection.DOWN
      ? `${styles.downButton} ${styles.active}`
      : styles.downButton;

  const handleUpClick = () => updateCurrentDirection(PredictionDirection.UP);
  const handleDownClick = () =>
    updateCurrentDirection(PredictionDirection.DOWN);
  const handlePredict = () =>
    user && currentDirection && placeNewPrediction(user.id, currentDirection);

  return (
    <div className={styles.prediction}>
      <h2 style={{ padding: "2rem 1rem" }}>Will the price of Bitcoin go:</h2>

      <div className={styles.directionButtonsContainer}>
        <Button
          className={upButtonStyles}
          disabled={lockedDirection}
          onClick={handleUpClick}
        >
          <span>Up</span> <Arrow className={styles.upArrow} />
        </Button>
        <Button
          className={downButtonStyles}
          disabled={lockedDirection}
          onClick={handleDownClick}
        >
          <span>Down</span> <Arrow className={styles.downArrow} />
        </Button>
      </div>
      <div className={styles.predictButtonContainer}>
        <Button
          className={styles.predictButton}
          disabled={lockedDirection}
          onClick={handlePredict}
        >
          Place Prediction
        </Button>
      </div>

      <Tutorial />
    </div>
  );
};

export default Prediction;
