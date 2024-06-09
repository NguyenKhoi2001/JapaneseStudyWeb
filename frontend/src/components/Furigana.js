import React, { useState, useEffect } from "react";
import { convertToHiragana } from "../services/gooLab.api";
import { generateFuriganaMarkup } from "../utils/furiganaMapper";
import styles from "./css/Furigana.module.css";

const Furigana = ({ baseText, className }) => {
  const [renderedText, setRenderedText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAndSetFurigana = async () => {
      try {
        const hiragana = await convertToHiragana(baseText);
        const markup = generateFuriganaMarkup(baseText, hiragana);
        setRenderedText(markup);
        setError(""); // Reset error state in case of successful fetch
      } catch (error) {
        console.error("Error processing text for Furigana:", error);
        setError("Error processing text for Furigana. Please try again later.");
      }
    };

    fetchAndSetFurigana();
  }, [baseText]);

  return (
    <div>
      {error ? (
        <div>{error}</div>
      ) : (
        <div
          className={className ? className : styles.furiganaText}
          dangerouslySetInnerHTML={{ __html: renderedText }}
        />
      )}
    </div>
  );
};

export default Furigana;
