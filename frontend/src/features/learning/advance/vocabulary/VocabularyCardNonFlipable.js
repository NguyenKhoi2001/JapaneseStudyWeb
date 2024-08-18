import React from "react";
import styles from "./css/VocabularyCardNonFlipable.module.css";
import Furigana from "../../../../components/Furigana";
import { useTranslation } from "react-i18next";
import CustomImage from "../../../../components/CustomImage";

const VocabularyCardNonFlipable = ({
  imageUrl = "https://via.placeholder.com/200",
  hiraganaKatakana = "----",
  kanji = "----",
  examples = [],
  meanings = "----",
  sinoVietnameseSounds = "----",
}) => {
  const { t } = useTranslation("advanceLearning");

  const isMeaningful = meanings && meanings !== "----"; // Check if meanings has a meaningful value
  const hasReadings = sinoVietnameseSounds && sinoVietnameseSounds !== "----"; // Check if readings has a meaningful value

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imageSection}>
          <CustomImage
            src={imageUrl}
            alt={t("advancedLearning.vocabulary.card.vocabulary")}
            className={styles.cardImage}
            translationFilename="advanceLearning"
          />
        </div>
        <div className={styles.infoSection}>
          <div className={styles.cell}>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>
                {t("advancedLearning.vocabulary.card.vocabulary")}
              </div>
            </div>
            <div className={styles.contentWrapper}>
              <div className={styles.content}>{hiraganaKatakana}</div>
            </div>
          </div>
          <div className={styles.cell}>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>
                {t("advancedLearning.vocabulary.card.kanji")}
              </div>
            </div>
            <div className={styles.contentWrapper}>
              <div className={styles.content}>{kanji}</div>
            </div>
          </div>
          <div className={`${styles.cell} ${styles.fullWidth}`}>
            <div className={styles.titleWrapper}>
              <div className={`${styles.title} ${styles.exampleTitle}`}>
                {t("advancedLearning.vocabulary.card.example")}
              </div>
            </div>
            <div className={styles.contentWrapper}>
              <div className={styles.content}>
                {examples.map((example, index) => (
                  <div key={index}>
                    <Furigana
                      baseText={example.sentence}
                      className={styles.furigana}
                    />
                    <div className={styles.exampleTranslation}>
                      {example.meaning}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {isMeaningful && (
            <div className={styles.cell}>
              <div className={styles.titleWrapper}>
                <div className={styles.title}>
                  {t("advancedLearning.vocabulary.card.meaning")}
                </div>
              </div>
              <div className={styles.contentWrapper}>
                <div className={styles.content}>{meanings}</div>
              </div>
            </div>
          )}
          {hasReadings && (
            <div className={styles.cell}>
              <div className={styles.titleWrapper}>
                <div className={styles.title}>
                  {t("advancedLearning.vocabulary.card.readings")}
                </div>
              </div>
              <div className={styles.contentWrapper}>
                <div className={styles.content}>{sinoVietnameseSounds}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VocabularyCardNonFlipable;
