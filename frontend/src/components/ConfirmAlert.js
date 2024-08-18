import React from "react";
import styles from "./css/ConfirmAlert.module.css"; // Ensure you have this CSS module

const ConfirmAlert = ({ message, isVisible, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.container}>
        <div className={styles.message}>{message}</div>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${styles.confirmButton}`}
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAlert;
