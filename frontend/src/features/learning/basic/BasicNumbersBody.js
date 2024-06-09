// JapaneseNumbersGrid.js
import React, { useEffect, useState } from "react";
import styles from "./css/BasicNumbersBody.module.css";

const numbers = [
  { num: 0, hiragana: "ゼロ" },
  { num: 1, hiragana: "いち" },
  { num: 2, hiragana: "に" },
  { num: 3, hiragana: "さん" },
  { num: 4, hiragana: "よん" },
  { num: 5, hiragana: "ご" },
  { num: 6, hiragana: "ろく" },
  { num: 7, hiragana: "なな" },
  { num: 8, hiragana: "はち" },
  { num: 9, hiragana: "きゅう/く" },
  { num: 10, hiragana: "じゅう" },
  { num: 15, hiragana: "じゅうご" },
  { num: 20, hiragana: "にじゅう" },
  { num: 25, hiragana: "にじゅうご" },
  { num: 30, hiragana: "さんじゅう" },
  { num: 37, hiragana: "さんじゅうなな" },
  { num: 40, hiragana: "よんじゅう" },
  { num: 50, hiragana: "ごじゅう" },
  { num: 60, hiragana: "ろくじゅう" },
  { num: 70, hiragana: "ななじゅう" },
  { num: 80, hiragana: "はちじゅう" },
  { num: 90, hiragana: "きゅうじゅう" },
  { num: 100, hiragana: "ひゃく" },
  { num: 1000, hiragana: "せん" },
  { num: 10000, hiragana: "まん" },
  { num: 100000, hiragana: "じゅうまん" },
  { num: 1000000, hiragana: "ひゃくまん" },
  { num: 10000000, hiragana: "せんまん" },
  { num: 100000000, hiragana: "おく" },
  { num: 1000000000, hiragana: "じゅうおく" },
];

const speakText = (text) => {
  if (!window.speechSynthesis) {
    alert("Your browser does not support speech synthesis.");
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel(); // Cancel any ongoing or queued speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  synth.speak(utterance);
};
const BasicNumbersBody = () => {
  const [selectedHiragana, setSelectedHiragana] = useState(
    `${numbers[0].num} - ${numbers[0].hiragana}`
  ); // Default to the first number
  const [selectedNum, setSelectedNum] = useState(numbers[0].num); // Track the selected number

  useEffect(() => {
    // Optionally, speak the first number on component mount
    speakText(numbers[0].hiragana);
  }, []);

  const handleCellClick = (num, hiragana) => {
    setSelectedNum(num); // Update the selected number
    setSelectedHiragana(num + " - " + hiragana); // Update the displayed hiragana
    speakText(hiragana); // Speak the hiragana
  };

  return (
    <>
      <div className={styles.displayHiragana}>{selectedHiragana}</div>
      <div className={styles.gridContainer}>
        {numbers.map(({ num, hiragana }) => (
          <div
            key={num}
            className={`${styles.cell} ${
              num === selectedNum ? styles.selectedCell : ""
            }`} // Apply selected style if this cell is selected
            onClick={() => handleCellClick(num, hiragana)}
            role="button"
            tabIndex={0}
          >
            <span>{num}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default BasicNumbersBody;
