import React, { useState } from "react";
import styles from "./css/Alphabet.module.css";
import PopUpAlphabet from "../PopUpAlphabet"; // Adjust this path as necessary

const HiraganaVoicedConsonants = () => {
  const [selectedChar, setSelectedChar] = useState({
    char: null,
    romaji: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCellClick = (char, romaji) => {
    setSelectedChar({ char, romaji });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Define the Japanese voiced consonants in rows
  const voicedConsonantsRows = [
    ["が", "ぎ", "ぐ", "げ", "ご"].map((char, index) => [
      char,
      ["ga", "gi", "gu", "ge", "go"][index],
    ]),
    ["ざ", "じ", "ず", "ぜ", "ぞ"].map((char, index) => [
      char,
      ["za", "ji", "zu", "ze", "zo"][index],
    ]),
    ["だ", "ぢ", "づ", "で", "ど"].map((char, index) => [
      char,
      ["da", "ji", "zu", "de", "do"][index],
    ]),
    ["ば", "び", "ぶ", "べ", "ぼ"].map((char, index) => [
      char,
      ["ba", "bi", "bu", "be", "bo"][index],
    ]),
    // Including the "p" sound, which uses the "handakuten" mark
    ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"].map((char, index) => [
      char,
      ["pa", "pi", "pu", "pe", "po"][index],
    ]),
  ];

  return (
    <>
      <div className={styles.grid}>
        {voicedConsonantsRows.flat().map(([char, romaji], index) => (
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

export default HiraganaVoicedConsonants;
