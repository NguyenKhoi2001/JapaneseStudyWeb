import React, { useEffect, useState } from "react";
import translateText from "../../utils/TranslateText"; // Adjusted to camelCase

const TestTranslate = () => {
  const [translatedText, setTranslatedText] = useState("");

  useEffect(() => {
    const translate = async () => {
      const text = "Hello, world!";
      // Adjusted language code for Spanish
      const translated = await translateText(text, "es");
      setTranslatedText(translated);
    };

    translate();
  }, []);

  return <div>{translatedText}</div>;
};

export default TestTranslate;
