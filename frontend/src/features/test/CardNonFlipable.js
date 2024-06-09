import React from "react";
import styles from "./CardNonFlipable.module.css";
import Furigana from "../../components/Furigana";

const CardNonFlipable = ({
  imageUrl = "https://via.placeholder.com/200",
  vocabulary = "----",
  kanji = "----",
  exampleSentence = "----",
  meaning = "----",
  sinoSound,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.imageSection}>
            <img src={imageUrl} alt="Card" className={styles.cardImage} />
          </div>
          <div className={styles.infoSection}>
            <div className={styles.cell}>
              <div className={styles.title}>Vocabulary</div>
              <div>{vocabulary}</div>
            </div>
            <div className={styles.cell}>
              <div className={styles.title}>Kanji</div>
              <div>{kanji}</div>
            </div>
            <div className={`${styles.cell} ${styles.fullWidth}`}>
              <div className={styles.title}>Example</div>
              <div>
                <Furigana
                  baseText={exampleSentence}
                  className={styles.furigana}
                />
              </div>
            </div>
            <div className={styles.cell}>
              <div className={styles.title}>Meaning</div>
              <div className={styles.meaning}>{meaning}</div>
            </div>
            {sinoSound && (
              <div className={styles.cell}>
                <div className={styles.title}>Readings</div>
                <div className={styles.readings}>{sinoSound}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardNonFlipable;
