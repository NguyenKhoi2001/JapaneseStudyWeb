import React, { useState } from "react";
import styles from "./css/KatakanaAlphabet.module.css"; // Adjust the path as needed
import PopUpAlphabet from "../PopUpAlphabet"; // Ensure this path is correct

const KatakanaCombinedSounds = () => {
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

  // Define combined consonant sounds for Katakana
  const combinedSoundsRows = [
    ["キャ", "キュ", "キョ"].map((char, index) => [
      char,
      ["kya", "kyu", "kyo"][index],
    ]),
    ["シャ", "シュ", "ショ"].map((char, index) => [
      char,
      ["sha", "shu", "sho"][index],
    ]),
    ["チャ", "チュ", "チョ"].map((char, index) => [
      char,
      ["cha", "chu", "cho"][index],
    ]),
    ["ニャ", "ニュ", "ニョ"].map((char, index) => [
      char,
      ["nya", "nyu", "nyo"][index],
    ]),
    ["ヒャ", "ヒュ", "ヒョ"].map((char, index) => [
      char,
      ["hya", "hyu", "hyo"][index],
    ]),
    ["ミャ", "ミュ", "ミョ"].map((char, index) => [
      char,
      ["mya", "myu", "myo"][index],
    ]),
    ["リャ", "リュ", "リョ"].map((char, index) => [
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
            <div>{char}</div> {/* Katakana */}
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

export default KatakanaCombinedSounds;
