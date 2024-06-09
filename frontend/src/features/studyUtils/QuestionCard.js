import React from "react";
import styles from "./css/QuestionCard.module.css";
import IconSpeaker from "../../components/IconSpeaker"; // Adjust path as needed

const QuestionCard = ({
  type,
  question,
  answers,
  correctAnswer,
  userAnswer,
  setUserAnswer,
  revealAnswers = false,
}) => {
  const handleAnswerClick = (index) => {
    if (!revealAnswers && setUserAnswer) {
      setUserAnswer(index);
    }
  };

  // Handling different types of questions
  const renderQuestionContent = () => {
    switch (type) {
      case "audio":
        return <IconSpeaker text={question} className={styles.iconButton} />;
      case "text":
      default:
        return <h2>{question}</h2>;
    }
  };

  const questionStyle = revealAnswers
    ? userAnswer === correctAnswer
      ? styles.questionCorrect
      : styles.questionIncorrect
    : styles.question;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={`${styles.questionSection} ${questionStyle}`}>
          {renderQuestionContent()}
        </div>
        <div className={styles.answerSection}>
          {answers.map((answer, index) => (
            <div
              key={index}
              className={`${styles.answer} ${
                index === userAnswer ? styles.selected : ""
              } ${
                revealAnswers
                  ? index === correctAnswer
                    ? index === userAnswer
                      ? styles.correct
                      : styles.correctAnswer
                    : index === userAnswer
                    ? styles.incorrect
                    : ""
                  : ""
              }`}
              onClick={() => handleAnswerClick(index)}
            >
              {answer}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
