import React, { useEffect, useRef, useState } from "react";
import styles from "./css/VocabularyCardFlipable.module.css";
import Furigana from "../../../../components/Furigana";
import { useTranslation } from "react-i18next";
import CustomImage from "../../../../components/CustomImage";

const VocabularyCardFlipable = ({
  imageUrl = "https://via.placeholder.com/200",
  hiraganaKatakana = "----",
  kanji = "----",
  sinoVietnameseSounds = "----",
  meanings = "----",
  examples = [],
}) => {
  const { t } = useTranslation("advanceLearning");
  const [flipped, setFlipped] = useState(false);

  const handleCardClick = () => {
    setFlipped(!flipped);
  };

  const [maxHeight, setMaxHeight] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    setMaxHeight(0);
    const calculateHeight = () => {
      const card = cardRef.current;
      if (card) {
        const front = card.querySelector(`.${styles.front}`);
        const back = card.querySelector(`.${styles.back}`);

        //manual height for card
        const calculatedHeight =
          Math.max(front.scrollHeight, back.scrollHeight) +
          100 +
          examples.length * 50;
        setMaxHeight(calculatedHeight);
      }
    };

    calculateHeight();
  }, [examples.length]);

  const isMeaningful = meanings && meanings !== "----"; // Check if meanings has a value if not then hide both label and value

  return (
    <div className={styles.container}>
      <div className={styles.deck}>
        <div
          ref={cardRef}
          className={`${styles.card} ${flipped ? styles.flipped : ""}`}
          onClick={handleCardClick}
          style={{ height: maxHeight }}
        >
          <div className={`${styles.front} ${styles.face}`}>
            <div className={styles.imageSection}>
              <CustomImage
                src={imageUrl}
                alt={t("advancedLearning.vocabulary.card.vocabulary")}
                className={styles.cardImage}
                translationFilename="advanceLearning"
              />
            </div>
            <div className={`${styles.infoSection} ${styles.frontInfo}`}>
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
                        <div key={index} className={styles.exampleTranslation}>
                          {example.meaning}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.back} ${styles.face}`}>
            <div className={`${styles.infoSection} ${styles.fullWidth}`}>
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
              {sinoVietnameseSounds && (
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
      </div>
    </div>
  );
};

export default VocabularyCardFlipable;
