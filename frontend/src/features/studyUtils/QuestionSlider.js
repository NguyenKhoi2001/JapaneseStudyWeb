import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import QuestionCard from "./QuestionCard";
import styles from "./css/QuestionSlider.module.css";
import {
  setActiveQuestionIndex,
  answerQuestion,
  setRevealAnswers,
  resetQuiz,
  fetchRandomQuestions,
} from "../../services/study/basicQuestionSlice";
import ErrorAlert from "../../components/ErrorAlert";

const QuestionSlider = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("basicLearning");
  const { questions, activeQuestionIndex, userAnswers, revealAnswers } =
    useSelector((state) => state.basicQuestion);

  const [localQuestions, setLocalQuestions] = useState([]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLocalQuestions(questions);
  }, [questions]);

  useEffect(() => {
    dispatch(fetchRandomQuestions());
  }, [dispatch]);

  const handlePrev = () => {
    dispatch(setActiveQuestionIndex(Math.max(activeQuestionIndex - 1, 0)));
  };

  const handleNext = () => {
    dispatch(
      setActiveQuestionIndex(
        Math.min(activeQuestionIndex + 1, localQuestions.length - 1)
      )
    );
  };

  const checkAnswer = () => {
    if (userAnswers.every((answer) => answer != null)) {
      dispatch(setRevealAnswers());
    } else {
      setErrorMessage(t("basicLearning.practiceQuestion.alertNotAnswered"));
      setErrorVisible(true);
    }
  };

  const handleReset = async () => {
    dispatch(resetQuiz());
    await dispatch(fetchRandomQuestions());
  };
  const handleCloseError = () => {
    setErrorVisible(false);
  };

  return (
    <>
      <div className={styles.infoContainer}>
        <div className={styles.infoBar}>
          <span>
            {t("basicLearning.practiceQuestion.question")}{" "}
            {activeQuestionIndex + 1}
          </span>
          <span>
            {t("basicLearning.practiceQuestion.total")} {localQuestions.length}
          </span>
        </div>
      </div>
      <div className={styles.sliderContainer}>
        <div className={styles.buttonDiv}>
          <button
            className={styles.prevButton}
            onClick={handlePrev}
            disabled={activeQuestionIndex === 0}
          >
            {t("basicLearning.practiceQuestion.prev")}
          </button>
        </div>
        <div className={styles.slider}>
          <div
            className={styles.slidesContainer}
            style={{ transform: `translateX(-${activeQuestionIndex * 100}%)` }}
          >
            {localQuestions.map((item, index) => (
              <div key={index} className={styles.slide}>
                <QuestionCard
                  {...item}
                  userAnswer={userAnswers[index]}
                  setUserAnswer={(answer) =>
                    dispatch(answerQuestion({ questionIndex: index, answer }))
                  }
                  revealAnswers={revealAnswers}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.buttonDiv}>
          <button
            className={styles.nextButton}
            onClick={handleNext}
            disabled={activeQuestionIndex === localQuestions.length - 1}
          >
            {t("basicLearning.practiceQuestion.next")}
          </button>
        </div>
      </div>
      <div className={styles.checkAnswerSection}>
        {revealAnswers ? (
          <button className={styles.checkButton} onClick={handleReset}>
            {t("basicLearning.practiceQuestion.doAgain")}
          </button>
        ) : (
          <button className={styles.checkButton} onClick={checkAnswer}>
            {t("basicLearning.practiceQuestion.checkAnswers")}
          </button>
        )}
      </div>
      <div className={styles.questionNavContainer}>
        <div className={styles.questionContainer}>
          {localQuestions.map((_, index) => (
            <button
              key={index}
              className={`${styles.navButton} ${
                index === activeQuestionIndex
                  ? styles.activeNavButton
                  : userAnswers[index] !== null
                  ? styles.answeredQuestion
                  : ""
              } ${
                revealAnswers &&
                userAnswers[index] !== questions[index].correctAnswer
                  ? styles.incorrectAnswer
                  : revealAnswers &&
                    userAnswers[index] === questions[index].correctAnswer
                  ? styles.correctAnswer
                  : ""
              }`}
              onClick={() => dispatch(setActiveQuestionIndex(index))}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <ErrorAlert
          message={errorMessage}
          isVisible={errorVisible}
          onClose={handleCloseError}
        />
      </div>
    </>
  );
};

export default QuestionSlider;
