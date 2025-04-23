import type { FC } from "react";
import styles from "./Header.module.css";

const Header: FC = () => {
  return (
    <header className={"header " + styles.header}>
      <h1 className={styles.headerText}>Predict-a-bit</h1>
    </header>
  );
};

export default Header;
