import type { FC } from "react";
import styles from "./Tutorial.module.css";

const Tutorial: FC = () => {
  return (
    <div className={styles.tutorial}>
      <h3> How to play:</h3>
      <ul>
        <li>
          Decide if you think the price of Bitcoin will go up or down in the
          next 60 seconds.
        </li>
        <li>Place your prediction.</li>
        <li>The price will be locked for those 60 seconds.</li>
        <li>
          You get one point if you were correct, and lose one point if you were
          incorrect.
        </li>
      </ul>
    </div>
  );
};

export default Tutorial;
