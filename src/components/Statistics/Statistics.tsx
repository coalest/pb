import React from "react";
import styles from "./Statistics.module.css";

import { useUser } from "../../hooks/useUser";

const Statistics: React.FC = () => {
  const { user } = useUser();

  return (
    <div className={"statistics " + styles.statistics}>
      <h2>Your Score</h2>
      <div className={styles.score}>{user?.score}</div>
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
              if (!prediction.status) return;

              const round = user.predictions.length - index;
              return (
                <tr>
                  <td>{round}</td>
                  <td>{prediction.status}</td>
                  <td>{prediction.direction}</td>
                  <td>{prediction.startPrice}</td>
                  <td>{prediction.finalPrice}</td>
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
