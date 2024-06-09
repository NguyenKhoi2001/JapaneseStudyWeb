// LoadingPage.js
import React from "react";
import styles from "./css/LoadingPage.module.css";

const LoadingPage = () => {
  return (
    <div className={styles.loadingWrapper}>
      <div className={styles.loadingText}>LOADING</div>
      <div className={styles.loadingContent}></div>
    </div>
  );
};

export default LoadingPage;
