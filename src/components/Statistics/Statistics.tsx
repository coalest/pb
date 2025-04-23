import type { FC } from "react";
import styles from "./Statistics.module.css";

import { useUser } from "../../hooks/useUser";

import { formatPriceInCents } from "../../utils/formatPrice";
import { Prediction } from "../../shared.types.ts";

const Statistics: FC = () => {
  const { user } = useUser();

  const isInProgress = (prediction: Prediction) =>
    !prediction.status || !prediction.finalPrice;

  const UserHistory: FC = () => {
    return user?.predictions.toReversed().map((prediction, index: number) => {
      if (isInProgress(prediction)) return;

      const round = user.predictions.length - index;
      return (
        <tr key={prediction.id}>
          <td>{round}</td>
          <td>{prediction.status}</td>
          <td>{prediction.direction}</td>
          <td>{formatPriceInCents(prediction.startPrice)}</td>
          <td>
            {prediction.finalPrice && formatPriceInCents(prediction.finalPrice)}
          </td>
        </tr>
      );
    });
  };
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
            <UserHistory />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistics;
