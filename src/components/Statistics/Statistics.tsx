import React from "react";
import styles from "./Statistics.module.css";

import { useUser } from "../../hooks/useUser";
import { useGame } from "../../hooks/useGame";

import { formatPriceInCents } from "../../utils/formatPrice";

const Statistics: React.FC = () => {
  const { user } = useUser();
  const { userScore } = useGame();

  return (
    <div className={"statistics " + styles.statistics}>
      <h2>Your Score</h2>
      <div className={styles.score}>{userScore}</div>
      <h2>History</h2>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Round</th>
              <th>Result</th>
              <th>Prediction</th>
              <th>Locked</th>
              <th>Final</th>
            </tr>
          </thead>
          <tbody>
            {user?.predictions.toReversed().map((prediction, index: number) => {
              if (!prediction.status || !prediction.finalPrice) return; // Skip in progress predictions

              const round = user.predictions.length - index;
              return (
                <tr key={user.id}>
                  <td>{round}</td>
                  <td>{prediction.status}</td>
                  <td>{prediction.direction}</td>
                  <td>{formatPriceInCents(prediction.startPrice)}</td>
                  <td>{formatPriceInCents(prediction.finalPrice)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistics;
