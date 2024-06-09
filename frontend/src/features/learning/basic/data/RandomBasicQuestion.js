import React, { useState, useEffect } from "react";

// Import your question data arrays
import {
  questionsDataHiraganaAudio,
  questionsDataHiraganaToRomaji,
} from "./HiraganaQuestionData";

import {
  questionsDataKatakanaAudio,
  questionsDataKatakanaToRomaji,
} from "./KatakanaQuestionData";

const RandomBasicQuestion = () => {
  const [randomQuestions, setRandomQuestions] = useState([]);

  useEffect(() => {
    const allQuestions = [
      ...questionsDataHiraganaToRomaji,
      ...questionsDataHiraganaAudio,
      ...questionsDataKatakanaToRomaji,
      ...questionsDataKatakanaAudio,
    ];
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, 20);
    setRandomQuestions(selectedQuestions);
  }, []);

  return (
    <div>
      <h1>Random Questions</h1>
      <ul>
        {randomQuestions.map((question, index) => (
          <li key={index}>
            Type: {question.type} - Question: {question.question} - Answers:{" "}
            {question.answers.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RandomBasicQuestion;
