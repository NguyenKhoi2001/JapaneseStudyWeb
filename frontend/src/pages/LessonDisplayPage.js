// LessonDisplayPage.js
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchLessonsForLevel } from "../services/level/levelSlice";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import LessonContainer from "../features/learning/advance/lesson/LessonContainer";
import styles from "./css/LessonDisplayPage.module.css";
import { useTranslation } from "react-i18next";

const LessonDisplayPage = () => {
  const { t } = useTranslation("advanceLearning");

  const { levelId } = useParams(); // Get levelId from URL
  const dispatch = useDispatch();

  useEffect(() => {
    if (levelId) {
      dispatch(fetchLessonsForLevel(levelId));
    }
  }, [levelId, dispatch]);

  const lessons = useSelector(
    (state) => state.level.lessonsByLevel[levelId] || []
  );
  const loading = useSelector((state) => state.level.status === "loading");
  const error = useSelector((state) => state.level.error);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <NavBar />
      <div className={styles.pageContainer}>
        <LessonContainer lessons={lessons} />
        <button
          className={styles.backButton}
          onClick={() => window.history.back()}
        >
          {t("advancedLearning.lesson.components.backButton")}
        </button>
      </div>
      <Footer />
    </>
  );
};

export default LessonDisplayPage;
