import React, { useState } from "react";
import styles from "./css/KanjiCardFlipable.module.css";

import { useTranslation } from "react-i18next";
import KanjiAnimationDisplay from "./KanjiAnimationDisplay";

const KanjiCardFlipable = ({
  imageUrl = "https://via.placeholder.com/200",
  character = "----",
  meaning = "----",
  sinoVietnameseSounds = "----",
  onyomi = [],
  kunyomi = [],
  examples = [
    {
      kanjiWord: "----",
      hiragana: "----",
      meaning: "----",
    },
  ],
}) => {
  const [flipped, setFlipped] = useState(false);
  const { t } = useTranslation("advanceLearning");

  const handleCardClick = () => {
    setFlipped(!flipped);
  };

  const imageNotAvailable =
    !imageUrl || imageUrl === "https://via.placeholder.com/200";

  return (
    <div className={styles.container}>
      <div className={styles.deck}>
        <div
          className={`${styles.card} ${flipped ? styles.flipped : ""}`}
          onClick={handleCardClick}
        >
          <div className={`${styles.front} ${styles.face}`}>
            {imageNotAvailable ? (
              <KanjiAnimationDisplay char={character} />
            ) : (
              <div className={styles.imageSection}>
                <img
                  src={imageUrl}
                  alt="Kanji Card"
                  className={styles.cardImage}
                />
              </div>
            )}
            <div className={styles.infoSection}>
              <div className={`${styles.cell} ${styles.fullWidth}`}>
                <div className={styles.title}>
                  {t("advancedLearning.kanji.card.kanjiTitle")}
                </div>
                <div>{character}</div>
              </div>
              <div className={`${styles.cell} ${styles.fullWidth}`}>
                <div className={styles.title}>
                  {t("advancedLearning.kanji.card.examplesTitle")}
                </div>
                <div className={styles.exampleGrid}>
                  <div className={styles.exampleHeader}>
                    {t("advancedLearning.kanji.card.exampleKanjiWord")}
                  </div>
                  <div className={styles.exampleHeader}>
                    {t("advancedLearning.kanji.card.exampleHiragana")}
                  </div>
                  <div className={styles.exampleHeader}>
                    {t("advancedLearning.kanji.card.exampleMeaning")}
                  </div>
                  {examples.map((example, index) => (
                    <React.Fragment key={index}>
                      <div>{example.kanjiWord}</div>
                      <div>{example.hiragana}</div>
                      <div>{example.meaning}</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.back} ${styles.face}`}>
            <div className={styles.cell}>
              <div className={styles.title}>
                {t("advancedLearning.kanji.card.meaningTitle")}
              </div>
              <div className={styles.backInfoText}>{meaning}</div>
            </div>
            <div className={styles.cell}>
              <div className={styles.title}>
                {t("advancedLearning.kanji.card.sinoVietnameseSoundsTitle")}
              </div>
              <div className={styles.backInfoText}>{sinoVietnameseSounds}</div>
            </div>
            <div className={styles.cell}>
              <div className={styles.title}>
                {t("advancedLearning.kanji.card.onyomiTitle")}
              </div>
              <div className={styles.backInfoText}>{onyomi.join(", ")}</div>
            </div>
            <div className={styles.cell}>
              <div className={styles.title}>
                {t("advancedLearning.kanji.card.kunyomiTitle")}
              </div>
              <div className={styles.backInfoText}>{kunyomi.join(", ")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanjiCardFlipable;
