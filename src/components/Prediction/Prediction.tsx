import { useState, type FC } from "react";

import styles from "./Prediction.module.css";

import Arrow from "../Arrow/Arrow.tsx";
import Button from "../Button/Button.tsx";
import Tutorial from "../Tutorial/Tutorial.tsx";

import { useUser } from "../../hooks/useUser";
import { useGame } from "../../hooks/useGame";

import { PredictionDirection } from "../../shared.types.ts";

const Prediction: FC = () => {
  const [currentDirection, setCurrentDirection] =
    useState<PredictionDirection>(null);

  const { placeNewPrediction, lockedDirection } = useGame();
  const { user } = useUser();

  const handleUpClick = () => setCurrentDirection("up");
  const handleDownClick = () => setCurrentDirection("down");

  return (
    <div className={styles.prediction}>
      <h2 style={{ padding: "2rem" }}>Will the price of Bitcoin go:</h2>

      <div className={styles.directionButtonsContainer}>
        <Button
          className={`${currentDirection === "up" ? styles.upButtonSelected : styles.upButton}`}
          disabled={!!lockedDirection}
          onClick={handleUpClick}
        >
          <span>Up</span> <Arrow className={styles.upArrow} />
        </Button>
        <Button
          className={`${currentDirection === "down" ? styles.downButtonSelected : styles.downButton}`}
          disabled={!!lockedDirection}
          onClick={handleDownClick}
        >
          <span>Down</span> <Arrow className={styles.downArrow} />
        </Button>
      </div>
      <div className={styles.predictButtonContainer}>
        <Button
          className={styles.predictButton}
          disabled={!!lockedDirection}
          onClick={() => user && placeNewPrediction(user.id, currentDirection)}
        >
          Place Prediction
        </Button>
      </div>

      <Tutorial />
    </div>
  );
};

export default Prediction;
