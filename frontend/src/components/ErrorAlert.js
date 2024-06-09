import React from "react";
import styles from "./css/ErrorAlert.module.css"; // Make sure to create this CSS module file

const ErrorAlert = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.container}>
        <div className={styles.message}>{message}</div>
        <button className={styles.button} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorAlert;
