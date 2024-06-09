import React, { useState } from "react";
import styles from "./CardFlipable.module.css";
import Furigana from "../../components/Furigana";

const CardFlipable = ({
  imageUrl = "https://via.placeholder.com/200",
  vocabulary = "----",
  kanji = "----",
  exampleSentence = "----",
  meaning = "----",
  sinoSound,
}) => {
  const [flipped, setFlipped] = useState(false);

  const handleCardClick = () => {
    setFlipped(!flipped);
  };

  return (
    <div className={styles.container}>
      <div className={styles.deck}>
        <div
          className={`${styles.card} ${flipped ? styles.flipped : ""}`}
          onClick={handleCardClick}
        >
          <div className={`${styles.front} ${styles.face}`}>
            <div className={styles.imageSection}>
              <img src={imageUrl} alt="Card" className={styles.cardImage} />
            </div>
            <div className={styles.infoSection}>
              <div className={styles.cell}>
                <div className={styles.title}>Vocabulary</div>
                <div>{vocabulary !== "----" ? vocabulary : "----"}</div>
              </div>
              <div className={styles.cell}>
                <div className={styles.title}>Kanji</div>
                <div>{kanji !== "----" ? kanji : "----"}</div>
              </div>
              <div className={`${styles.cell} ${styles.fullWidth}`}>
                <div className={styles.title}>Example</div>
                <div>
                  <Furigana
                    baseText={
                      exampleSentence !== "----" ? exampleSentence : "----"
                    }
                    className={styles.furigana}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.back} ${styles.face}`}>
            <div className={styles.cell}>
              <div className={styles.title}>Meaning</div>
              <div className={styles.meaning}>
                {meaning !== "----" ? meaning : "----"}
              </div>
            </div>
            {sinoSound && (
              <div className={styles.cell}>
                <div className={styles.title}>Readings</div>
                <div className={styles.readings}>
                  <div>{sinoSound}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardFlipable;
