import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./css/ListeningSlider.module.css";

const ListeningSlider = () => {
  const { t } = useTranslation("advanceLearning");

  return (
    <div className={styles.container}>
      <h1 className={styles.message}>
        {t("advancedLearning.listening.developmentMessage")}
      </h1>
    </div>
  );
};

export default ListeningSlider;
