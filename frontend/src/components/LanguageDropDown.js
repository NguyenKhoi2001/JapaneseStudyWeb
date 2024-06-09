import React, { useEffect, useMemo, useState } from "react";
import styles from "./css/LanguageDropdown.module.css";
import downArrow from "../assets/images/icons/DropDownIcon.png";
import vietnameseFlagImage from "../assets/images/VietnameseFlag.png";
import unitedStateFlagImage from "../assets/images/UnitedStateFlag.png";
import japaneseFlagImage from "../assets/images/JapaneseFlag.png";

const LanguageDropdown = ({ handleChangeLanguages, currentLanguage }) => {
  const options = useMemo(
    () => [
      {
        id: 1,
        text: "Tiếng Việt",
        imgSrc: vietnameseFlagImage,
        languageValue: "vi",
      },
      {
        id: 2,
        text: "English",
        imgSrc: unitedStateFlagImage,
        languageValue: "en",
      },
      { id: 3, text: "日本語", imgSrc: japaneseFlagImage, languageValue: "jp" },
    ],
    []
  ); // Dependency array is empty as these options do not depend on any external variables

  // Set the default selected option to the one matching current language
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(() =>
    options.find((option) => option.languageValue === currentLanguage)
  );

  useEffect(() => {
    // Update selected option when currentLanguage changes
    const newSelectedOption = options.find(
      (option) => option.languageValue === currentLanguage
    );
    setSelectedOption(newSelectedOption);
  }, [currentLanguage, options]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    handleChangeLanguages(option.languageValue);
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownHeader} onClick={() => setIsOpen(!isOpen)}>
        <img
          src={selectedOption.imgSrc}
          alt={selectedOption.text}
          className={styles.icon}
        />
        <span>{selectedOption.text}</span>
        <img src={downArrow} alt="Arrow" className={styles.arrow} />
      </div>

      {isOpen && (
        <ul className={styles.dropdownList}>
          {options.map((option) => (
            <li
              key={option.id}
              className={`${styles.dropdownItem} ${
                selectedOption?.id === option.id ? styles.selected : ""
              }`}
              onClick={() => handleSelect(option)}
              style={{
                pointerEvents:
                  selectedOption?.id === option.id ? "none" : "auto",
              }}
            >
              <img
                src={option.imgSrc}
                alt={option.text}
                className={styles.optionImage}
              />
              <span>{option.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageDropdown;
