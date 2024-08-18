import React, { useState } from "react";
import styles from "./css/Alphabet.module.css";
import PopUpAlphabet from "../PopUpAlphabet";

const Alphabet = () => {
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

  // Define the Japanese alphabet in rows, with null for missing spots
  const combinedAlphabetRows = [
    ["あ", "い", "う", "え", "お"].map((char, index) => [
      char,
      ["a", "i", "u", "e", "o"][index],
    ]),
    ["か", "き", "く", "け", "こ"].map((char, index) => [
      char,
      ["ka", "ki", "ku", "ke", "ko"][index],
    ]),
    ["さ", "し", "す", "せ", "そ"].map((char, index) => [
      char,
      ["sa", "shi", "su", "se", "so"][index],
    ]),
    ["た", "ち", "つ", "て", "と"].map((char, index) => [
      char,
      ["ta", "chi", "tsu", "te", "to"][index],
    ]),
    ["な", "に", "ぬ", "ね", "の"].map((char, index) => [
      char,
      ["na", "ni", "nu", "ne", "no"][index],
    ]),
    ["は", "ひ", "ふ", "へ", "ほ"].map((char, index) => [
      char,
      ["ha", "hi", "fu", "he", "ho"][index],
    ]),
    ["ま", "み", "む", "め", "も"].map((char, index) => [
      char,
      ["ma", "mi", "mu", "me", "mo"][index],
    ]),
    ["や", null, "ゆ", null, "よ"].map((char, index) => [
      char,
      ["ya", null, "yu", null, "yo"][index],
    ]),
    ["ら", "り", "る", "れ", "ろ"].map((char, index) => [
      char,
      ["ra", "ri", "ru", "re", "ro"][index],
    ]),
    ["わ", null, null, null, "を"].map((char, index) => [
      char,
      ["wa", null, null, null, "wo"][index],
    ]),
    [null, null, null, null, "ん"].map((char, index) => [
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

export default Alphabet;
