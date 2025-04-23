import { useState, type FC } from "react";

import styles from "./Prediction.module.css";

import Arrow from "../Arrow/Arrow.tsx";
import Button from "../Button/Button.tsx";
import Tutorial from "../Tutorial/Tutorial.tsx";

import { useUser } from "../../hooks/useUser";
import { useGame } from "../../hooks/useGame";

import { PredictionDirection } from "../../shared.types.ts";

const Prediction: FC = () => {
  const { user } = useUser();
  const { placeNewPrediction, lockedDirection } = useGame();

  const [currentDirection, setCurrentDirection] =
    useState<PredictionDirection | null>(null);

  const disabled = !!lockedDirection;

  const upButtonStyles =
    (currentDirection === PredictionDirection.UP ? `${styles.active} ` : "") +
    styles.upButton;
  const downButtonStyles =
    (currentDirection === PredictionDirection.DOWN ? `${styles.active} ` : "") +
    styles.downButton;

  const handleUpClick = () => setCurrentDirection(PredictionDirection.UP);
  const handleDownClick = () => setCurrentDirection(PredictionDirection.DOWN);
  const handlePredict = () =>
    user && currentDirection && placeNewPrediction(user.id, currentDirection);

  return (
    <div className={styles.prediction}>
      <h2 style={{ padding: "2rem" }}>Will the price of Bitcoin go:</h2>

      <div className={styles.directionButtonsContainer}>
        <Button
          className={upButtonStyles}
          disabled={disabled}
          onClick={handleUpClick}
        >
          <span>Up</span> <Arrow className={styles.upArrow} />
        </Button>
        <Button
          className={downButtonStyles}
          disabled={disabled}
          onClick={handleDownClick}
        >
          <span>Down</span> <Arrow className={styles.downArrow} />
        </Button>
      </div>
      <div className={styles.predictButtonContainer}>
        <Button
          className={styles.predictButton}
          disabled={disabled}
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
