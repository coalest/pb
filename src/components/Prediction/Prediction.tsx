import React, { useState } from "react";
import styles from "./Prediction.module.css";

import Arrow from "../Arrow/Arrow.tsx";
import Button from "../Button/Button.tsx";
import Tutorial from "../Tutorial/Tutorial.tsx";

const Prediction: React.FC = () => {
  type PredictionType = "up" | "down" | null;

  const [currentPrediction, setCurrentPrediction] =
    useState<PredictionType>(null);

  const handleUpClick = () => setCurrentPrediction("up");
  const handleDownClick = () => setCurrentPrediction("down");

  return (
    <div className={"prediction " + styles.prediction}>
      <h2 style={{ padding: "2rem" }}>Will the price of Bitcoin go:</h2>

      <div style={{ display: "flex", gap: "25px", justifyContent: "center" }}>
        <Button
          className={`${currentPrediction === "up" ? styles.upButtonSelected : styles.upButton}`}
          disabled={false}
          onClick={handleUpClick}
        >
          <span>Up</span> <Arrow className={styles.upArrow} />
        </Button>
        <Button
          className={`${currentPrediction === "down" ? styles.downButtonSelected : styles.downButton}`}
          disabled={false}
          onClick={handleDownClick}
        >
          <span>Down</span> <Arrow className={styles.downArrow} />
        </Button>
      </div>
      <div style={{ display: "flex", gap: "25px", justifyContent: "center" }}>
        <Button
          className={styles.predictionButton}
          disabled={false}
          onClick={handleUpClick}
        >
          Place Prediction
        </Button>
      </div>

      <Tutorial />
    </div>
  );
};

export default Prediction;
