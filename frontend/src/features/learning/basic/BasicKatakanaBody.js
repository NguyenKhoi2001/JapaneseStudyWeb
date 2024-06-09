import React, { useState } from "react";
import styles from "./css/BasicKatakanaBody.module.css"; // Ensure CSS module path is correct
import KatakanaAlphabet from "./katakana/KatakanaAlphabet"; // Ensure this path is correct
import { useTranslation } from "react-i18next";
import KatakanaVoicedConsonants from "./katakana/KatakanaVoiceConsonants";
import KatakanaCombinedSounds from "./katakana/KatakanaCombinedSounds";
import KatakanaLongVowels from "./katakana/KatakanaLongVowels";
import KatakanaGlottalStops from "./katakana/KatakanaGlottalStops";

const BasicKatakanaBody = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useTranslation();

  // Update navItems to use correct translation keys for katakana
  //   const navItems = [
  //     t("basicLearning.katakana.basicKatakana.alphabet"),
  //     t("basicLearning.katakana.basicKatakana.compoundSounds"),
  //     t("basicLearning.katakana.basicKatakana.combinedSounds"),
  //     t("basicLearning.katakana.basicKatakana.longVowels"),
  //     t("basicLearning.katakana.basicKatakana.voicedSounds"),
  //     t("basicLearning.katakana.basicKatakana.practice"),
  //   ];

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

  const contentForIndex = (index) => {
    switch (index) {
      case 0:
        return <KatakanaAlphabet />;
      case 1:
        return <KatakanaVoicedConsonants />;
      case 2:
        return <KatakanaCombinedSounds />;
      case 3:
        return <KatakanaLongVowels />;
      case 4:
        return <KatakanaGlottalStops />;
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

export default BasicKatakanaBody;
