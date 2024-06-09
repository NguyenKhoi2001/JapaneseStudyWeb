import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./css/AdvancedContainer.module.css";
// import VocabularyBody from "./VocabularyBody";
// import KanjiBody from "./KanjiBody";
// import GrammarBody from "./GrammarBody";
// import ReadingBody from "./ReadingBody";
// import ListeningBody from "./ListeningBody";
// import AdvancedPracticeBody from "./AdvancedPracticeBody";

const AdvancedContainer = () => {
  const [activeView, setActiveView] = useState("vocabulary");
  const { t } = useTranslation(); // Use the translation hook

  const changeView = (view) => {
    setActiveView(view);
  };

  const renderView = () => {
    switch (activeView) {
      case "vocabulary":
        return <div>Hello from Vocabulary!</div>;
      case "kanji":
        return <div>Hello from Kanji!</div>;
      case "grammar":
        return <div>Hello from Grammar!</div>;
      case "reading":
        return <div>Hello from Reading!</div>;
      case "listening":
        return <div>Hello from Listening!</div>;
      case "practice":
        return <div>Hello from Practice!</div>;
      default:
        return <div>Hello from Vocabulary!</div>;
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
          className={getButtonClassName("vocabulary")}
          onClick={() => changeView("vocabulary")}
        >
          {t("advancedLearning.vocabulary.title")}
        </button>
        <button
          className={getButtonClassName("kanji")}
          onClick={() => changeView("kanji")}
        >
          {t("advancedLearning.kanji.title")}
        </button>
        <button
          className={getButtonClassName("grammar")}
          onClick={() => changeView("grammar")}
        >
          {t("advancedLearning.grammar")}
        </button>
        <button
          className={getButtonClassName("reading")}
          onClick={() => changeView("reading")}
        >
          {t("advancedLearning.reading")}
        </button>
        <button
          className={getButtonClassName("listening")}
          onClick={() => changeView("listening")}
        >
          {t("advancedLearning.listening")}
        </button>
        <button
          className={getButtonClassName("practice")}
          onClick={() => changeView("practice")}
        >
          {t("advancedLearning.practice")}
        </button>
      </nav>
      <div className={styles.mainContent}>{renderView()}</div>
    </div>
  );
};

export default AdvancedContainer;
