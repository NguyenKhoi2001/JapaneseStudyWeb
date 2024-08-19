import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  createQuestion,
  updateQuestion,
} from "../../../../services/question/questionSlice";
import styles from "./css/QuestionForm.module.css";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ErrorAlert from "../../../../components/ErrorAlert";
import SuccessAlert from "../../../../components/SuccessAlert";
import LoadingPage from "../../../../pages/LoadingPage";
import {
  fetchResourceByLesson,
  modifyLessonItems,
} from "../../../../services/lesson/lessonSlice";

const QuestionForm = ({
  onClose,
  formDataInit = {},
  formType = "add",
  lessonId,
}) => {
  const { t } = useTranslation("advanceLearning");
  const dispatch = useDispatch();

  const defaultFormData = useMemo(
    () => ({
      text: "",
      textAsking: {
        en: "",
        vi: "",
        jp: "",
      },
      answers: [""],
      correctAnswer: 0,
      difficulty: "Easy",
    }),
    []
  );

  const [formData, setFormData] = useState(
    formType === "add" ? defaultFormData : formDataInit
  );
  const [initialData, setInitialData] = useState(formDataInit);
  const [isModified, setIsModified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (formType === "update") {
      setFormData(formDataInit);
      setInitialData(formDataInit);
    }
  }, [formDataInit, formType]);

  const checkIsModified = (newFormData) => {
    return JSON.stringify(newFormData) !== JSON.stringify(initialData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsModified(checkIsModified({ ...formData, [name]: value }));
  };

  const handleTextAskingChange = (language, value) => {
    const newTextAsking = {
      ...formData.textAsking,
      [language]: value,
    };
    setFormData((prev) => ({
      ...prev,
      textAsking: newTextAsking,
    }));
    setIsModified(checkIsModified({ ...formData, textAsking: newTextAsking }));
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = formData.answers.map((answer, i) =>
      i === index ? value : answer
    );
    setFormData((prev) => ({
      ...prev,
      answers: updatedAnswers,
    }));
    setIsModified(checkIsModified({ ...formData, answers: updatedAnswers }));
  };

  const addAnswer = () => {
    if (formData.answers.length < 4) {
      const newAnswers = [...formData.answers, ""];
      setFormData((prev) => ({
        ...prev,
        answers: newAnswers,
      }));
      setIsModified(checkIsModified({ ...formData, answers: newAnswers }));
    }
  };

  const removeAnswer = (index) => {
    const updatedAnswers = formData.answers.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      answers: updatedAnswers,
      correctAnswer: 0,
    }));
    setIsModified(checkIsModified({ ...formData, answers: updatedAnswers }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isModified) {
      setError(t("advancedLearning.question.questionForm.noChangesMade"));
      setShowError(true);
      return;
    }

    setLoading(true);
    const { _id, ...updates } = formData;

    const action =
      formType === "add"
        ? createQuestion(formData)
        : updateQuestion({ id: _id, updates });

    try {
      const result = await dispatch(action).unwrap();

      if (formType === "add" && result._id) {
        if (lessonId) {
          await dispatch(
            modifyLessonItems({
              id: lessonId,
              add: { questions: [result._id] },
              remove: {},
            })
          ).unwrap();
        }

        setSuccessMessage(
          t("advancedLearning.question.questionForm.questionAddedSuccessfully")
        );
      } else {
        setSuccessMessage(
          t(
            "advancedLearning.question.questionForm.questionUpdatedSuccessfully"
          )
        );
      }

      setShowSuccess(true);

      if (lessonId) {
        await dispatch(fetchResourceByLesson(lessonId)).unwrap();
      }

      onClose();
    } catch (error) {
      setError(
        t("advancedLearning.question.questionForm.failedToSubmitForm") +
          ": " +
          error.message
      );
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };
  const editableDivRef = useRef(null);
  const handleUnderlineClick = () => {
    document.execCommand("underline", false, null);
  };
  const handleTextChange = () => {
    if (editableDivRef.current) {
      setFormData((prev) => ({
        ...prev,
        text: editableDivRef.current.innerHTML,
      }));
    }
  };
  return (
    <div className={styles.overlay}>
      {loading && <LoadingPage opacity={0.7} />}
      <div className={styles.container}>
        <button className={styles.closeFormButton} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.centerText}>
            {t("advancedLearning.question.questionForm.title")}
          </h2>

          {}
          <div className={styles.inputContainer}>
            <label className={styles.label}>
              {t("advancedLearning.question.questionForm.generalQuestionText")}
            </label>
            <div className={styles.editorContainer}>
              <div
                contentEditable
                ref={editableDivRef}
                className={styles.editableDiv}
                onInput={handleTextChange}
                dangerouslySetInnerHTML={{ __html: formData.text }}
              ></div>
            </div>
            <button
              type="button"
              className={styles.underlineButton}
              onClick={handleUnderlineClick}
            >
              {t("advancedLearning.question.questionForm.underlineButton")}
            </button>
          </div>

          {}
          <div className={styles.inputContainer}>
            <label className={styles.label}>
              {t("advancedLearning.question.questionForm.questionTextEn")}
            </label>
            <input
              type="text"
              name="textAsking.en"
              className={styles.input}
              placeholder={t(
                "advancedLearning.question.questionForm.enterQuestion"
              )}
              onChange={(e) => handleTextAskingChange("en", e.target.value)}
              value={formData.textAsking.en}
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label}>
              {t("advancedLearning.question.questionForm.questionTextVi")}
            </label>
            <input
              type="text"
              name="textAsking.vi"
              className={styles.input}
              placeholder={t(
                "advancedLearning.question.questionForm.enterQuestion"
              )}
              onChange={(e) => handleTextAskingChange("vi", e.target.value)}
              value={formData.textAsking.vi}
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label}>
              {t("advancedLearning.question.questionForm.questionTextJp")}
            </label>
            <input
              type="text"
              name="textAsking.jp"
              className={styles.input}
              placeholder={t(
                "advancedLearning.question.questionForm.enterQuestion"
              )}
              onChange={(e) => handleTextAskingChange("jp", e.target.value)}
              value={formData.textAsking.jp}
            />
          </div>

          {}
          {formData.answers.map((answer, index) => (
            <div key={index} className={styles.answerInputContainer}>
              <label className={styles.label}>
                <span>
                  {t("advancedLearning.question.questionForm.answer")}{" "}
                  {index + 1}
                </span>
              </label>
              <input
                type="text"
                className={styles.input}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                value={answer}
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeAnswer(index)}
              >
                {t("advancedLearning.question.questionForm.remove")}
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.addButton}
            onClick={addAnswer}
            disabled={formData.answers.length >= 4}
          >
            {t("advancedLearning.question.questionForm.addAnswer")}
          </button>

          {}
          <div className={styles.inputContainer}>
            <label className={styles.label}>
              {t("advancedLearning.question.questionForm.correctAnswer")}
            </label>
            <select
              name="correctAnswer"
              className={styles.select}
              onChange={handleInputChange}
              value={formData.correctAnswer}
            >
              {formData.answers.map((answer, index) => (
                <option key={index} value={index}>
                  {answer}
                </option>
              ))}
            </select>
          </div>

          {}
          <div className={styles.inputContainer}>
            <label className={styles.label}>
              {t("advancedLearning.question.questionForm.difficulty.label")}
            </label>
            <select
              name="difficulty"
              className={styles.select}
              onChange={handleInputChange}
              value={formData.difficulty}
            >
              <option value="Easy">
                {t("advancedLearning.question.questionForm.difficulty.easy")}
              </option>
              <option value="Medium">
                {t("advancedLearning.question.questionForm.difficulty.medium")}
              </option>
              <option value="Hard">
                {t("advancedLearning.question.questionForm.difficulty.hard")}
              </option>
            </select>
          </div>

          {}
          <div className={styles.submitContainer}>
            <button type="submit" className={styles.submitButton}>
              {t("advancedLearning.question.questionForm.submit")}
            </button>
          </div>
        </form>
      </div>

      {}
      <SuccessAlert
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
      <ErrorAlert
        message={error}
        isVisible={showError}
        onClose={() => setShowError(false)}
      />
    </div>
  );
};

export default QuestionForm;
