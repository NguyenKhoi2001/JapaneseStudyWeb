import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./css/HiraganaGlottalStop.module.css"; // Adjust the path as needed

const HiraganaGlottalStop = () => {
  const { t } = useTranslation();

  const renderStyledText = (base, styled) => {
    if (!styled) return base; // No styling needed
    const regex = new RegExp(`(?!^)(${styled})`);
    const parts = base.split(regex);
    return parts.map((part, index) =>
      part === styled && !(index === 0 && base.startsWith(styled)) ? (
        <span key={index} className={styles.red}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Adjusted to render Section 3 examples in a 3-column grid
  const renderSection3Examples = () => {
    const examples = t("basicLearning.hiragana.glottalStop.section3.examples", {
      returnObjects: true,
    });
    return (
      <div className={`${styles.grid} ${styles.threeColumnGrid}`}>
        {examples.map((example, index) => (
          <React.Fragment key={index}>
            <div className={styles.word}>{example.hiragana}</div>
            <div className={styles.word}>{example.romaji}</div>
            <div className={styles.word}>{example.meaning}</div>
          </React.Fragment>
        ))}
      </div>
    );
  };
  // Adjusted to accept and apply a specific grid class
  const renderExamples = (sectionKey, gridClass) => {
    const examples = t(`${sectionKey}.examples`, { returnObjects: true });
    return (
      <div className={`${styles.grid} ${styles[gridClass]}`}>
        {examples.map((example, index) => (
          <>
            <div key={index} className={styles.word}>
              <b>{renderStyledText(example.hiragana, example.styled)}</b>
            </div>
            <div className={styles.contentText}>{example.meaning}</div>
          </>
        ))}
      </div>
    );
  };
  return (
    <div className={styles.container}>
      {/* Section 1 */}
      <div className={styles.section}>
        <h2 className={styles.title}>
          <span className={styles.sectionNumber}>1</span>
          {t("basicLearning.hiragana.glottalStop.section1.title")}
        </h2>
        <p className={styles.contentText}>
          {t("basicLearning.hiragana.glottalStop.section1.content")}
        </p>
      </div>

      {/* Section 2 */}
      <div className={styles.section}>
        <h2 className={styles.title}>
          <span className={styles.sectionNumber}>2</span>
          {t("basicLearning.hiragana.glottalStop.section2.title")}
        </h2>
        {/* Assuming renderExamples works correctly for Section 2 */}
        {renderExamples(
          "basicLearning.hiragana.glottalStop.section2",
          "twoColumnGrid"
        )}
      </div>

      {/* Section 3 with adjusted 3-column grid display */}
      <div className={styles.section}>
        <h2 className={styles.title}>
          <span className={styles.sectionNumber}>3</span>
          {t("basicLearning.hiragana.glottalStop.section3.title")}
        </h2>
        <p className={styles.contentText}>
          {t("basicLearning.hiragana.glottalStop.section3.content")}
        </p>
        {renderSection3Examples()}
      </div>

      {/* Section 4 */}
      <div className={styles.section}>
        <h2 className={styles.title}>
          <span className={styles.sectionNumber}>4</span>
          {t("basicLearning.hiragana.glottalStop.section4.title")}
        </h2>
        <p className={styles.contentText}>
          {t("basicLearning.hiragana.glottalStop.section4.content")}
        </p>
      </div>
    </div>
  );
};

export default HiraganaGlottalStop;
