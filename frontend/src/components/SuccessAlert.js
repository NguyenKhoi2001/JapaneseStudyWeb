import React from "react";
import styles from "./css/SuccessAlert.module.css";

const SuccessAlert = ({ message, isVisible, onClose }) => {
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

export default SuccessAlert;
