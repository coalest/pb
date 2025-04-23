import React from "react";
import styles from "./GameBox.module.css";

type GameBoxProps = {
  children: React.ReactNode;
};

const GameBox = ({ children }: GameBoxProps) => {
  return <div className={styles.gameBox}>{children}</div>;
};

export default GameBox;
