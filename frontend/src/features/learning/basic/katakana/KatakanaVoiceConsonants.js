import React, { useState } from "react";
import styles from "./css/KatakanaAlphabet.module.css"; // Adjust this path as necessary
import PopUpAlphabet from "../PopUpAlphabet"; // Ensure this path is correct

const KatakanaVoicedConsonants = () => {
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

  // Define the Japanese Katakana voiced consonants in rows
  const voicedConsonantsRows = [
    ["ガ", "ギ", "グ", "ゲ", "ゴ"].map((char, index) => [
      char,
      ["ga", "gi", "gu", "ge", "go"][index],
    ]),
    ["ザ", "ジ", "ズ", "ゼ", "ゾ"].map((char, index) => [
      char,
      ["za", "ji", "zu", "ze", "zo"][index],
    ]),
    ["ダ", "ヂ", "ヅ", "デ", "ド"].map((char, index) => [
      char,
      ["da", "ji", "zu", "de", "do"][index], // Note: "ji" and "zu" here could also be represented differently depending on the system
    ]),
    ["バ", "ビ", "ブ", "ベ", "ボ"].map((char, index) => [
      char,
      ["ba", "bi", "bu", "be", "bo"][index],
    ]),
    // Including the "p" sound, which uses the "handakuten" mark
    ["パ", "ピ", "プ", "ペ", "ポ"].map((char, index) => [
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

export default KatakanaVoicedConsonants;
