import React from "react";
import styles from "./Statistics.module.css";

const Statistics: React.FC = () => {
  return (
    <div className={"statistics " + styles.statistics}>
      <h2>Your Score</h2>
      <div className={styles.score}>0</div>
      <h2>History</h2>
      <caption></caption>
      <div style={{ overflowX: "auto", width: "100%", padding: "0.25rem" }}>
        <table>
          <thead>
            <tr>
              <th>Round</th>
              <th>Score</th>
              <th>Prediction</th>
              <th>Locked</th>
              <th>Final</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>-1</td>
              <td>Up</td>
              <td>$84,321.50</td>
              <td>$84,298.30</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistics;
