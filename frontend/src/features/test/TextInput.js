import React, { useState } from "react";
import TestSpeaker from "./TestSpeaker"; // Adjust the import path as needed

const TextInputAndSpeaker = () => {
  const [text, setText] = useState("");

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text to speak"
      />
      <TestSpeaker text={text} />
    </div>
  );
};

export default TextInputAndSpeaker;
