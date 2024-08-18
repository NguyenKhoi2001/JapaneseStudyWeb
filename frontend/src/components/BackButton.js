import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./css/BackButton.module.css";

const BackButton = ({ isVisible = true }) => {
  const { t } = useTranslation("componentsTranslation");
  const buttonStyle = isVisible
    ? styles.backButton
    : `${styles.backButton} ${styles.hidden}`;

  return (
    <button onClick={() => window.history.back()} className={buttonStyle}>
      <span className={styles.triangleLeft}></span>
      <span className={styles.label}>
        <span className={styles.innerLabel}>{t("BackButton.goBack")}</span>
      </span>
    </button>
  );
};

export default BackButton;
