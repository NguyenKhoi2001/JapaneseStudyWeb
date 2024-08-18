import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "./css/KanjiAnimationDisplay.module.css";
import KanjiAnimation from "../../../homepage/KanjiAnimation";
import IconSpeaker from "../../../../components/IconSpeaker";

const KanjiAnimationDisplay = ({ char }) => {
  const kanjiAnimationRef = useRef();

  const handleDrawClick = (event) => {
    event.stopPropagation();
    if (kanjiAnimationRef.current) {
      kanjiAnimationRef.current.startAnimation();
    }
  };

  const isValidKanji = (char) => {
    const codePoint = char.codePointAt(0);
    // Common Kanji block range and CJK Unified Ideographs Extension A
    return (
      (codePoint >= 0x4e00 && codePoint <= 0x9faf) ||
      (codePoint >= 0x3400 && codePoint <= 0x4dbf)
    ); // Extension A
  };

  if (!isValidKanji(char)) {
    return null; // Return null if it's not a valid Kanji character
  }

  const formatUnicode = (char) => {
    const unicode = char.charCodeAt(0).toString(16);
    return unicode.length === 4 ? `0${unicode}` : unicode;
  };

  const kanjiUnicode = formatUnicode(char);

  return (
    <div className={styles.animationContainer}>
      <div className={styles.kanjiAnimationContainer}>
        <KanjiAnimation
          ref={kanjiAnimationRef}
          kanjiUnicode={kanjiUnicode}
          className={styles.kanjiAnimation}
        />
      </div>
      <div className={styles.controls}>
        <IconSpeaker text={char} className={styles.iconButton} />
        <button onClick={handleDrawClick} className={styles.iconButton}>
          <FontAwesomeIcon icon={faPencilAlt} />
        </button>
      </div>
    </div>
  );
};

export default KanjiAnimationDisplay;
