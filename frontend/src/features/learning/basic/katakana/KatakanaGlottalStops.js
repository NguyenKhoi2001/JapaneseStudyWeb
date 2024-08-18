import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./css/KatakanaGlottalStops.module.css";

const KatakanaGlottalStops = () => {
  const { t } = useTranslation("basicLearning");

  // Function to render 2-column grid examples for Section 1 and 2
  const renderTwoColumnExamples = (examples) => {
    return examples.map((example, index) => (
      <div key={index} className={styles.grid}>
        <div className={styles.word}>
          <b>{example.katakana}</b>
        </div>
        <div className={styles.wordExplain}>{example.meaning}</div>
      </div>
    ));
  };

  // Function to render 3-column grid examples for Section 3
  const renderThreeColumnExamples = (examples) => {
    return examples.map((example, index) => (
      <div key={index} className={`${styles.grid} ${styles.gridThreeColumns}`}>
        <div className={styles.word}>{example.katakana}</div>
        <div className={styles.wordExplain}>{example.romaji}</div>
        <div className={styles.wordExplain}>{example.meaning}</div>
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      {/* Section 1 */}
      <div className={styles.section}>
        <h2 className={styles.title}>
          <span className={styles.sectionNumber}>1</span>
          {t("basicLearning.katakana.katakanaGlottalStop.section1.title")}
        </h2>
        <p>
          {t("basicLearning.katakana.katakanaGlottalStop.section1.content")}
        </p>
        {renderTwoColumnExamples(
          t("basicLearning.katakana.katakanaGlottalStop.section1.examples", {
            returnObjects: true,
          })
        )}
      </div>

      {/* Section 2 */}
      <div className={styles.section}>
        <h2 className={styles.title}>
          <span className={styles.sectionNumber}>2</span>
          {t("basicLearning.katakana.katakanaGlottalStop.section2.title")}
        </h2>
        <p>
          {t("basicLearning.katakana.katakanaGlottalStop.section2.content")}
        </p>
        {renderTwoColumnExamples(
          t("basicLearning.katakana.katakanaGlottalStop.section2.examples", {
            returnObjects: true,
          })
        )}
      </div>

      {/* Section 3 */}
      <div className={styles.section}>
        <h2 className={styles.title}>
          <span className={styles.sectionNumber}>3</span>
          {t("basicLearning.katakana.katakanaGlottalStop.section3.title")}
        </h2>
        <p>
          {t("basicLearning.katakana.katakanaGlottalStop.section3.content")}
        </p>
        {renderThreeColumnExamples(
          t("basicLearning.katakana.katakanaGlottalStop.section3.examples", {
            returnObjects: true,
          })
        )}
      </div>
    </div>
  );
};

export default KatakanaGlottalStops;
