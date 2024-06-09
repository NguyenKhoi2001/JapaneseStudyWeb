import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./css/BasicContainer.module.css";
import BasicHiraganaBody from "./BasicHiraganaBody";
import BasicKatakanaBody from "./BasicKatakanaBody";
import BasicNumbersBody from "./BasicNumbersBody";
import BasicPracticeBody from "./BasicPracticeBody";

const BasicContainer = () => {
  const [activeView, setActiveView] = useState("hiragana");
  const { t } = useTranslation(); // Use the translation hook

  const changeView = (view) => {
    setActiveView(view);
  };

  const renderView = () => {
    switch (activeView) {
      case "hiragana":
        return <BasicHiraganaBody />;
      case "katakana":
        return <BasicKatakanaBody />;
      case "numbers":
        return <BasicNumbersBody />;
      case "practice":
        return <BasicPracticeBody />;
      default:
        return <BasicHiraganaBody />;
    }
  };

  const getButtonClassName = (viewName) => {
    return activeView === viewName
      ? `${styles.toggleViewBtn} ${styles.activeToggleViewBtn}`
      : styles.toggleViewBtn;
  };

  return (
    <div className={styles.container}>
      <nav className={styles.verticalNav}>
        <button
          className={getButtonClassName("hiragana")}
          onClick={() => changeView("hiragana")}
        >
          {t("basicLearning.hiragana.title")}
        </button>
        <button
          className={getButtonClassName("katakana")}
          onClick={() => changeView("katakana")}
        >
          {t("basicLearning.katakana.title")}
        </button>
        <button
          className={getButtonClassName("numbers")}
          onClick={() => changeView("numbers")}
        >
          {t("basicLearning.numbers")}
        </button>
        <button
          className={getButtonClassName("practice")}
          onClick={() => changeView("practice")}
        >
          {t("basicLearning.practice")}
        </button>
      </nav>
      <div className={styles.mainContent}>{renderView()}</div>
    </div>
  );
};

export default BasicContainer;
