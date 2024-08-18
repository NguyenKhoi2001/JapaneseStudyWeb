import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./css/LongVowelsKatakana.module.css";

const KatakanaLongVowels = () => {
  const { t } = useTranslation("basicLearning");

  const renderSubSectionExamples = (subSections) => {
    return subSections.map((subSection, subIndex) => (
      <div key={subIndex} className={styles.subSection}>
        <h3 className={styles.subTitle}>{subSection.title}</h3>
        <p>{subSection.intro}</p>
        {subSection.examples.map((example, exampleIndex) => (
          <div key={`${subIndex}-${exampleIndex}`} className={styles.wordRow}>
            {example.exampleIntro && <p>{example.exampleIntro}</p>}
            <b>{example.base}</b> - {example.translation}
          </div>
        ))}
      </div>
    ));
  };

  const renderSection3 = () => {
    const section3Data = t(
      `basicLearning.katakana.longVowelsKatakana.section3`,
      { returnObjects: true }
    );
    const subSections = section3Data.subSections;

    return (
      <div className={styles.section}>
        <h2 className={styles.title}>
          <span className={styles.sectionNumber}>3</span> {section3Data.title}
        </h2>
        <p>{section3Data.content}</p>
        {renderSubSectionExamples(subSections)}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Section 1 */}
      <div className={styles.section}>
        <h2 className={styles.title}>
          <span className={styles.sectionNumber}>1</span>
          {t("basicLearning.katakana.longVowelsKatakana.section1.title")}
        </h2>
        <p>{t("basicLearning.katakana.longVowelsKatakana.section1.content")}</p>
      </div>

      {/* Section 2 */}
      <div className={styles.section}>
        <h2 className={styles.title}>
          <span className={styles.sectionNumber}>2</span>
          {t("basicLearning.katakana.longVowelsKatakana.section2.title")}
        </h2>
        <p>{t("basicLearning.katakana.longVowelsKatakana.section2.intro")}</p>
        <div className={styles.grid}>
          {t("basicLearning.katakana.longVowelsKatakana.section2.examples", {
            returnObjects: true,
          }).map((example, index) => (
            <div key={index} className={styles.wordRow}>
              <div className={styles.word}>
                <b>{example.base}</b>
              </div>
              <div>{example.translation}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 with Sub-Sections */}
      {renderSection3()}
    </div>
  );
};

export default KatakanaLongVowels;
