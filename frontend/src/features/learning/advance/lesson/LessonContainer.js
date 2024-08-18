// LessonContainer.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as fullStar,
  faStarHalfAlt as halfStar,
  faStar as emptyStar,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./css/LessonContainer.module.css";
import lockImage from "../../../../assets/images/lock.png";
import unlockImage from "../../../../assets/images/unlock.png";
import {
  checkCanStartLesson,
  fetchAllUserProgress,
} from "../../../../services/userProgress/userProgressSlice";
import ErrorAlert from "../../../../components/ErrorAlert";
import { useTranslation } from "react-i18next";

const LessonContainer = ({ lessons }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation("advanceLearning");
  const currentLanguage = i18n.language;
  const { currentUserData } = useSelector((state) => state.user);
  const { userId } = currentUserData;
  const { progress, canStart } = useSelector((state) => state.userProgress);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [navigateToLogin, setNavigateToLogin] = useState(false); // New state to track navigation

  useEffect(() => {
    // Fetch all user progress on component mount
    if (userId) {
      dispatch(fetchAllUserProgress(userId));
    }
  }, [dispatch, userId]);

  // Ensure the progress is loaded
  useEffect(() => {
    const checkLessonsSequentially = async () => {
      for (let index = 0; index < lessons.length; index++) {
        const lesson = lessons[index];
        if (index === 0) {
          // Always check the first lesson
          await dispatch(checkCanStartLesson({ userId, lessonId: lesson._id }));
        } else {
          // For subsequent lessons, check only if the previous lesson is accessible
          const prevLessonId = lessons[index - 1]._id;
          if (canStart[prevLessonId]) {
            if (!canStart.hasOwnProperty(lesson._id)) {
              await dispatch(
                checkCanStartLesson({ userId, lessonId: lesson._id })
              );
            }
          }
        }
      }
    };

    checkLessonsSequentially();
  }, [dispatch, userId, lessons, canStart]);

  const handleLessonClick = (lessonId, index) => {
    if (canStart[lessonId]) {
      navigate("/advance-learning", { state: { lessonId } });
    } else if (!userId) {
      setErrorMessage(
        t("advancedLearning.lesson.errorMessages.notAuthAndClickLesson")
      );

      setErrorVisible(true);
      setNavigateToLogin(true); // Set the intent to navigate after error is closed
    } else {
      setErrorMessage(t("advancedLearning.lesson.errorMessages.notPassPrev"));
      setErrorVisible(true);
    }
  };

  const calculateStars = (score) => {
    const filledStars = Math.floor(score / 20);
    const halfStar = score % 20 >= 10 ? 1 : 0;
    return {
      filled: filledStars,
      half: halfStar,
      empty: 5 - filledStars - halfStar,
    };
  };
  const handleCloseError = () => {
    setErrorVisible(false);
    if (navigateToLogin) {
      navigate("/login");
    }
  };
  return (
    <div className={styles.grid}>
      {lessons.map((lesson, index) => {
        const userLessonProgress = progress.find(
          (p) => p.lesson._id === lesson._id
        ) || { score: 0, passed: false };
        const { filled, half, empty } = calculateStars(
          userLessonProgress.score
        );
        const lessonAccessible = canStart[lesson._id] || index === 0;
        const lessonTitle = lesson.title[currentLanguage] || lesson.title.en;
        return (
          <div
            key={lesson._id}
            className={`${styles.lessonItem} ${
              !lessonAccessible ? styles.disabled : ""
            }`}
            onClick={() => handleLessonClick(lesson._id, index)}
          >
            <img
              src={lessonAccessible ? unlockImage : lockImage}
              alt={lessonAccessible ? "Unlocked" : "Locked"}
              className={styles.lessonImage}
            />
            <div className={styles.title}>{lessonTitle}</div>
            <div className={styles.stars}>
              {Array.from({ length: filled }).map((_, idx) => (
                <FontAwesomeIcon
                  icon={fullStar}
                  key={idx}
                  style={{ color: "gold" }}
                />
              ))}
              {half ? (
                <FontAwesomeIcon icon={halfStar} style={{ color: "gold" }} />
              ) : null}
              {Array.from({ length: empty }).map((_, idx) => (
                <FontAwesomeIcon
                  icon={emptyStar}
                  key={idx}
                  style={{ color: "grey" }}
                />
              ))}
            </div>
          </div>
        );
      })}
      <ErrorAlert
        message={errorMessage}
        isVisible={errorVisible}
        onClose={handleCloseError}
      />
    </div>
  );
};

export default LessonContainer;
