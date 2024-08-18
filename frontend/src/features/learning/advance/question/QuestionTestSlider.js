import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import QuestionCard from "./QuestionCard";
import QuestionForm from "./QuestionForm";
import AdminControllerContainer from "../AdminControllerContainer"; // Import AdminControllerContainer
import styles from "./css/QuestionSlider.module.css";
import { removeQuestion } from "../../../../services/question/questionSlice";
import ErrorAlert from "../../../../components/ErrorAlert";
import { updateUserProgress } from "../../../../services/userProgress/userProgressSlice";
import { useNavigate } from "react-router-dom";
import { fetchResourceByLesson } from "../../../../services/lesson/lessonSlice";
import ConfirmAlert from "../../../../components/ConfirmAlert";

const QuestionTestSlider = ({ questions, lessonId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("advanceLearning");
  const { currentUserData } = useSelector((state) => state.user);
  const { userId } = currentUserData;
  const selectedLevelId = useSelector((state) => state.level.selectedLevelId);

  useEffect(() => {
    if (!selectedLevelId) {
      navigate("/learning");
    }
  }, [selectedLevelId, navigate]);

  const [localQuestions, setLocalQuestions] = useState(questions);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showNextLessonButton, setShowNextLessonButton] = useState(false);
  const [showForm, setShowForm] = useState(false); // Manage form visibility
  const [formType, setFormType] = useState("add"); // Form type: add or update
  const [formData, setFormData] = useState(null); // Initial form data
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(
    Array(questions ? questions.length : 0).fill(null)
  );
  const [revealAnswers, setRevealAnswers] = useState(false);

  useEffect(() => {
    setLocalQuestions(questions);
    setUserAnswers(Array(questions.length).fill(null));
  }, [questions]);

  const handlePrev = () => {
    setActiveQuestionIndex(Math.max(activeQuestionIndex - 1, 0));
  };

  const handleNext = () => {
    setActiveQuestionIndex(
      Math.min(activeQuestionIndex + 1, localQuestions.length - 1)
    );
  };

  const handleAnswerChange = (index, answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = answer;
    setUserAnswers(newAnswers);
  };

  const calculateScore = () => {
    const correctAnswers = localQuestions.reduce((total, question, index) => {
      return total + (userAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    return Math.round((correctAnswers / localQuestions.length) * 100);
  };

  const checkAnswer = () => {
    if (userAnswers.every((answer) => answer !== null)) {
      setRevealAnswers(true);
      const score = calculateScore();

      if (score > 70) {
        setShowNextLessonButton(true);
      }

      if (userId) {
        const progressData = {
          user: userId,
          lesson: lessonId,
          score: score,
        };
        dispatch(updateUserProgress(progressData));
      }
    } else {
      setErrorMessage(t("advancedLearning.question.alertNotAnswered"));
      setErrorVisible(true);
    }
  };

  const handleReset = () => {
    setActiveQuestionIndex(0);
    setUserAnswers(Array(localQuestions.length).fill(null));
    setRevealAnswers(false);
  };

  const handleNextLesson = () => {
    navigate(`/level/${selectedLevelId}`);
  };

  const handleCloseError = () => {
    setErrorVisible(false);
  };

  const getDisplayText = (question) => {
    if (question.text) {
      return question.text;
    } else {
      return question.textAsking[i18n.language] || question.textAsking.vi;
    }
  };

  const handleDeleteQuestion = async () => {
    await dispatch(removeQuestion(localQuestions[activeQuestionIndex]._id));
    await dispatch(fetchResourceByLesson(lessonId));
    handleReset();
    setConfirmVisible(false);
  };

  const handleOpenForm = ({ type, data }) => {
    if (type === "delete") {
      setConfirmVisible(true);
    } else {
      setFormType(type);
      setFormData(data || {});
      setShowForm(true);
    }
  };

  const confirmDeletion = () => handleDeleteQuestion();
  const cancelDeletion = () => setConfirmVisible(false);
  return (
    <>
      <div className={styles.infoContainer}>
        <div className={styles.infoBar}>
          <span>
            {t("advancedLearning.question.question")} {activeQuestionIndex + 1}
          </span>
          <span>
            {t("advancedLearning.question.total")} {localQuestions.length}
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
            {t("advancedLearning.question.prev")}
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
                  question={getDisplayText(item)}
                  userAnswer={userAnswers[index]}
                  setUserAnswer={(answer) => handleAnswerChange(index, answer)}
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
            {t("advancedLearning.question.next")}
          </button>
        </div>
      </div>
      <div className={styles.checkAnswerSection}>
        {revealAnswers ? (
          <>
            <button className={styles.checkButton} onClick={handleReset}>
              {t("advancedLearning.question.doAgain")}
            </button>
            {showNextLessonButton && (
              <button className={styles.checkButton} onClick={handleNextLesson}>
                {t("advancedLearning.question.goNextLesson")}
              </button>
            )}
          </>
        ) : (
          <button className={styles.checkButton} onClick={checkAnswer}>
            {t("advancedLearning.question.checkAnswers")}
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
                userAnswers[index] !== localQuestions[index].correctAnswer
                  ? styles.incorrectAnswer
                  : revealAnswers &&
                    userAnswers[index] === localQuestions[index].correctAnswer
                  ? styles.correctAnswer
                  : ""
              }`}
              onClick={() => setActiveQuestionIndex(index)}
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
      {showForm && (
        <QuestionForm
          formDataInit={formData}
          formType={formType}
          onClose={() => setShowForm(false)}
          lessonId={lessonId}
        />
      )}
      <AdminControllerContainer
        roles={currentUserData.roles}
        currentData={localQuestions[activeQuestionIndex]}
        onOpenForm={handleOpenForm}
      />
      <ConfirmAlert
        message={t("advancedLearning.admin.confirmDelete")}
        isVisible={confirmVisible}
        onConfirm={confirmDeletion}
        onCancel={cancelDeletion}
      />
    </>
  );
};

export default QuestionTestSlider;
