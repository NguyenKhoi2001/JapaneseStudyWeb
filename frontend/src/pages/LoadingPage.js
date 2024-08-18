import React from "react";
import styles from "./css/LoadingPage.module.css";

const LoadingPage = ({ opacity = 1 }) => {
  // Correctly use destructuring with a default value
  return (
    <div
      className={styles.loadingWrapper}
      style={{ opacity: opacity, zIndex: 5 }}
    >
      <div className={styles.loadingText}>LOADING</div>
      <div className={styles.loadingContent}></div>
    </div>
  );
};

export default LoadingPage;
