import React from "react";
import styles from "./GameBox.module.css";

type GameBoxProps = {
  children: React.ReactNode;
  gridArea: string;
};

const GameBox = ({ children, gridArea }: GameBoxProps) => {
  return (
    <div style={{ gridArea: `${gridArea}` }} className={styles.gameBox}>
      {children}
    </div>
  );
};

export default GameBox;
