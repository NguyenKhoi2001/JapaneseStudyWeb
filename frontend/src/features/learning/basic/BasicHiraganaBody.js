import React, { useState } from "react";
import styles from "./css/BasicHiraganaBody.module.css";
import Alphabet from "./hiragana/Alphabet"; // Ensure this path is correct
import { useTranslation } from "react-i18next";
import HiraganaVoicedConsonants from "./hiragana/HiraganaVoiceConsonants";
import HiraganaCombinedSounds from "./hiragana/HiraganaCombinedSounds";
import HiraganaLongVowels from "./hiragana/HiraganaLongVowels";
import HiraganaGlottalStop from "./hiragana/HiraganaGlottalStop";

const BasicHiraganaBody = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useTranslation();

  // Update navItems to use correct translation keys
  const navItems = [
    t("basicLearning.hiragana.basicHiragana.alphabet"),
    t("basicLearning.hiragana.basicHiragana.compoundSounds"),
    t("basicLearning.hiragana.basicHiragana.combinedSounds"),
    t("basicLearning.hiragana.basicHiragana.longVowels"),
    t("basicLearning.hiragana.basicHiragana.voicedSounds"),
    t("basicLearning.hiragana.basicHiragana.practice"),
  ];

  const handleNavClick = (index) => {
    setActiveIndex(index);
  };

  // Adjusted to include Alphabet component for "A"
  const contentForIndex = (index) => {
    switch (index) {
      case 0:
        return <Alphabet />;
      case 1:
        return <HiraganaVoicedConsonants />;
      case 2:
        return <HiraganaCombinedSounds />;
      case 3:
        return <HiraganaLongVowels />;
      case 4:
        return <HiraganaGlottalStop />;
      default:
        return <div>Body {navItems[index]}</div>;
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.navbar}>
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`${styles.navItem} ${
              index === activeIndex ? styles.active : ""
            }`}
            onClick={() => handleNavClick(index)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className={styles.contentWrapper}>
        <div
          className={styles.contents}
          style={{ transform: `translateX(-${activeIndex * 1300}px)` }}
        >
          {navItems.map((item, index) => (
            <div key={index} className={styles.content}>
              {contentForIndex(index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicHiraganaBody;
