import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./css/LongVowels.module.css"; // Adjust the path as needed

const HiraganaLongVowels = () => {
  const { t } = useTranslation("basicLearning");

  const renderStyledText = (base, styled) => {
    if (!styled) return base; // No styling needed
    // Create a regular expression that avoids matching the styled text at the beginning
    const regex = new RegExp(`(?!^)(${styled})`);
    const parts = base.split(regex);
    return parts.map((part, index) => {
      // Avoid styling the first occurrence if it's at the beginning
      if (part === styled && !(index === 0 && base.startsWith(styled))) {
        return (
          <span key={index} className={styles.red}>
            {part}
          </span>
        );
      } else {
        return part;
      }
    });
  };

  const renderExamples = (sectionKey) => {
    const examples = t(`${sectionKey}.examples`, { returnObjects: true });
    return examples.map((example, index) => (
      <div className={styles.word} key={index}>
        <b>{renderStyledText(example.base, example.styled)}</b>
        <br />
        {example.translation}
      </div>
    ));
  };

  const renderSection4SubSections = () => {
    const subSections = t(
      "basicLearning.hiragana.longVowels.section4.subSections",
      { returnObjects: true }
    );

    return subSections.map((subSection, subIndex) => (
      <div key={subIndex} className={styles.section4SubSection}>
        <h3 className={styles.subTitle}>{subSection.title}</h3>
        <p>{subSection.intro}</p>
        {subSection.examples.map((example, exampleIndex) => (
          <div key={exampleIndex} className={styles.wordRow}>
            <b>{renderStyledText(example.base, example.styled)}</b> -{" "}
            {example.translation}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      {/* Section 1 */}
      <div className={styles.section}>
        <h2 className={styles.title}>
          <span className={styles.sectionNumber}>1</span>{" "}
          {t("basicLearning.hiragana.longVowels.section1.title")}
        </h2>
        <p>{t("basicLearning.hiragana.longVowels.section1.content")}</p>
      </div>

      {/* Section 2 */}
      <div className={styles.section}>
        <h2 className={styles.title}>
          <span className={styles.sectionNumber}>2</span>{" "}
          {t("basicLearning.hiragana.longVowels.section2.title")}
        </h2>
        <p className={styles.exampleTitle}>
          {t("basicLearning.hiragana.longVowels.section2.intro")}
        </p>
        <div className={styles.grid}>
          {renderExamples("basicLearning.hiragana.longVowels.section2")}
        </div>
      </div>

      {/* Section 3 */}
      <div className={styles.section}>
        <h2 className={styles.title}>
          <span className={styles.sectionNumber}>3</span>{" "}
          {t("basicLearning.hiragana.longVowels.section3.title")}
        </h2>
        <p>{t("basicLearning.hiragana.longVowels.section3.content")}</p>
      </div>

      {/* New Section 4 */}
      <div className={styles.section}>
        <h2 className={styles.title}>
          <span className={styles.sectionNumber}>4</span>{" "}
          {t("basicLearning.hiragana.longVowels.section4.title")}
        </h2>
        <div>{renderSection4SubSections()}</div>
      </div>
    </div>
  );
};

export default HiraganaLongVowels;
