import React, { useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./css/PopUpAlphabet.module.css";
import IconSpeaker from "../../../components/IconSpeaker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import KanjiAnimation from "../../homepage/KanjiAnimation";
import { useTranslation } from "react-i18next";

const PopUpAlphabet = ({ char, romaji, onClose }) => {
  const { t } = useTranslation("basicLearning");
  const kanjiAnimationRef = useRef();

  const handleDrawClick = () => {
    if (kanjiAnimationRef.current) {
      kanjiAnimationRef.current.startAnimation();
    }
  };

  if (!char) return null;

  // Format the unicode with padding if necessary
  const formatUnicode = (char) => {
    const unicode = char.charCodeAt(0).toString(16);
    return unicode.length === 4 ? `0${unicode}` : unicode;
  };

  const kanjiUnicode = formatUnicode(char);

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton}>
          {t("popupAlphabet.close")}
        </button>
        <div className={styles.modalContent}>
          <div className={styles.charInfo}>
            <KanjiAnimation
              ref={kanjiAnimationRef}
              kanjiUnicode={kanjiUnicode}
              className={styles.kanjiAnimation}
            />
          </div>
          <div className={styles.rightSection}>
            <p>{romaji}</p> {/* Romaji */}
            <div className={styles.soundAndDraw}>
              {/* Sound and Draw Icons/Buttons */}
              <IconSpeaker text={char} className={styles.iconButton} />
              {/* Replace with actual sound play functionality */}
              <button onClick={handleDrawClick} className={styles.iconButton}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default PopUpAlphabet;
