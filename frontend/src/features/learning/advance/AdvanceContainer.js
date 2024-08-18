import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./css/AdvancedContainer.module.css";
import VocabularyCardSlider from "./vocabulary/VocabularyCardSlider";
import KanjiCardSlider from "./kanji/KanjiCardSlider";
import GrammarDisplay from "./grammar/GrammarDisplay";
import QuestionTestSlider from "./question/QuestionTestSlider";
import ReadingSlider from "./reading/ReadingSlider";
import ListeningSlider from "./listening/ReadingSlider";

const AdvancedContainer = ({ lesson }) => {
  const [activeView, setActiveView] = useState("vocabulary");
  const { t } = useTranslation("advanceLearning"); // Use the translation hook

  const changeView = (view) => {
    setActiveView(view);
  };

  const lessonId = lesson.resources._id;
  const renderView = () => {
    switch (activeView) {
      case "vocabulary":
        return (
          <VocabularyCardSlider
            vocabularies={lesson.resources.vocabularies}
            lessonId={lessonId}
          />
        );
      case "kanji":
        return (
          <KanjiCardSlider
            kanjis={lesson.resources.kanjis}
            lessonId={lessonId}
          />
        );
      case "grammar":
        return (
          <GrammarDisplay
            grammars={lesson.resources.grammars}
            lessonId={lessonId}
          />
        );
      case "reading":
        return <ReadingSlider />;
      case "listening":
        return <ListeningSlider />;
      case "practice":
        return (
          <div>
            <QuestionTestSlider
              questions={lesson.resources.questions}
              lessonId={lessonId}
            />
          </div>
        );
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
          {t("advancedLearning.grammar.title")}
        </button>
        <button
          className={getButtonClassName("reading")}
          onClick={() => changeView("reading")}
        >
          {t("advancedLearning.reading.title")}
        </button>
        <button
          className={getButtonClassName("listening")}
          onClick={() => changeView("listening")}
        >
          {t("advancedLearning.listening.title")}
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
