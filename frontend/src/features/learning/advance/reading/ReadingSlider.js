import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./css/ReadingSlider.module.css";

const ReadingSlider = () => {
  const { t } = useTranslation("advanceLearning");

  return (
    <div className={styles.container}>
      <h1 className={styles.message}>
        {t("advancedLearning.reading.developmentMessage")}
      </h1>
    </div>
  );
};

export default ReadingSlider;
