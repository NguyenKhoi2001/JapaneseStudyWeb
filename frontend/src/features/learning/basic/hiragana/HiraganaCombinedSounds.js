import React, { useState } from "react";
import styles from "./css/Alphabet.module.css"; // Adjust the path as needed
import PopUpAlphabet from "../PopUpAlphabet"; // Ensure this path is correct

const HiraganaCombinedSounds = () => {
  const [selectedChar, setSelectedChar] = useState({
    char: null,
    romaji: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle cell click
  const handleCellClick = (char, romaji) => {
    setSelectedChar({ char, romaji });
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Define combined consonant sounds
  const combinedSoundsRows = [
    ["きゃ", "きゅ", "きょ"].map((char, index) => [
      char,
      ["kya", "kyu", "kyo"][index],
    ]),
    ["しゃ", "しゅ", "しょ"].map((char, index) => [
      char,
      ["sha", "shu", "sho"][index],
    ]),
    ["ちゃ", "ちゅ", "ちょ"].map((char, index) => [
      char,
      ["cha", "chu", "cho"][index],
    ]),
    ["にゃ", "にゅ", "にょ"].map((char, index) => [
      char,
      ["nya", "nyu", "nyo"][index],
    ]),
    ["ひゃ", "ひゅ", "ひょ"].map((char, index) => [
      char,
      ["hya", "hyu", "hyo"][index],
    ]),
    ["みゃ", "みゅ", "みょ"].map((char, index) => [
      char,
      ["mya", "myu", "myo"][index],
    ]),
    ["りゃ", "りゅ", "りょ"].map((char, index) => [
      char,
      ["rya", "ryu", "ryo"][index],
    ]),
  ];

  return (
    <>
      <div className={styles.grid3}>
        {combinedSoundsRows.flat().map(([char, romaji], index) => (
          <div
            key={index}
            className={`${styles.cell} ${
              char === null ? styles.emptyCell : ""
            }`}
            onClick={() => char && handleCellClick(char, romaji)}
          >
            <div>{char}</div> {/* Hiragana */}
            <div className={styles.romaji}>{romaji}</div> {/* Romaji */}
          </div>
        ))}
      </div>
      {isModalOpen && (
        <PopUpAlphabet
          char={selectedChar.char}
          romaji={selectedChar.romaji}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default HiraganaCombinedSounds;
