import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const IconSpeaker = ({ text, className }) => {
  const speakText = (event) => {
    event.stopPropagation();
    if (!window.speechSynthesis) {
      alert("Your browser does not support speech synthesis.");
      return;
    }
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP"; // Set the language to Japanese
    utterance.volume = 1; // Ensure maximum volume
    synth.speak(utterance);
  };

  return (
    <button onClick={speakText} className={className}>
      <FontAwesomeIcon icon={faVolumeUp} />
    </button>
  );
};

export default IconSpeaker;
