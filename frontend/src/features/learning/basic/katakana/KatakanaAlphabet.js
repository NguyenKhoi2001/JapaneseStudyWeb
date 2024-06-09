import React, { useState } from "react";
import styles from "./css/KatakanaAlphabet.module.css"; // Adjust path as necessary
import PopUpAlphabet from "../PopUpAlphabet";

const KatakanaAlphabet = () => {
  // State to manage the selected character and its romaji
  const [selectedChar, setSelectedChar] = useState({
    char: null,
    romaji: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle cell click
  const handleCellClick = (char, romaji) => {
    setSelectedChar({ char, romaji });
    setIsModalOpen(true); // Show the modal
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Define the Japanese Katakana alphabet in rows
  const combinedAlphabetRows = [
    ["ア", "イ", "ウ", "エ", "オ"].map((char, index) => [
      char,
      ["a", "i", "u", "e", "o"][index],
    ]),
    ["カ", "キ", "ク", "ケ", "コ"].map((char, index) => [
      char,
      ["ka", "ki", "ku", "ke", "ko"][index],
    ]),
    ["サ", "シ", "ス", "セ", "ソ"].map((char, index) => [
      char,
      ["sa", "shi", "su", "se", "so"][index],
    ]),
    ["タ", "チ", "ツ", "テ", "ト"].map((char, index) => [
      char,
      ["ta", "chi", "tsu", "te", "to"][index],
    ]),
    ["ナ", "ニ", "ヌ", "ネ", "ノ"].map((char, index) => [
      char,
      ["na", "ni", "nu", "ne", "no"][index],
    ]),
    ["ハ", "ヒ", "フ", "ヘ", "ホ"].map((char, index) => [
      char,
      ["ha", "hi", "fu", "he", "ho"][index],
    ]),
    ["マ", "ミ", "ム", "メ", "モ"].map((char, index) => [
      char,
      ["ma", "mi", "mu", "me", "mo"][index],
    ]),
    ["ヤ", null, "ユ", null, "ヨ"].map((char, index) => [
      char,
      ["ya", null, "yu", null, "yo"][index],
    ]),
    ["ラ", "リ", "ル", "レ", "ロ"].map((char, index) => [
      char,
      ["ra", "ri", "ru", "re", "ro"][index],
    ]),
    ["ワ", null, null, null, "ヲ"].map((char, index) => [
      char,
      ["wa", null, null, null, "wo"][index],
    ]),
    [null, null, null, null, "ン"].map((char, index) => [
      char,
      [null, null, null, null, "n"][index],
    ]),
  ];
  return (
    <>
      <div className={styles.grid}>
        {combinedAlphabetRows.flat().map(([char, romaji], index) => (
          <div
            key={index}
            className={`${styles.cell} ${
              char === null ? styles.emptyCell : ""
            }`}
            onClick={() => char && handleCellClick(char, romaji)} // Only trigger for non-null cells
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

export default KatakanaAlphabet;
