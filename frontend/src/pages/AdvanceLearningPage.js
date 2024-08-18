import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchResourceByLesson } from "../services/lesson/lessonSlice"; // Import the correct thunk
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import AdvancedContainer from "../features/learning/advance/AdvanceContainer";
import styles from "./css/AdvanceLearningPage.module.css";

const AdvanceLearningPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lessonId = location.state ? location.state.lessonId : null;
  const lesson = useSelector((state) => state.lesson.selectedLesson); // This will now include resources

  // Fetch lesson data with resources if only ID is provided
  useEffect(() => {
    if (lessonId) {
      dispatch(fetchResourceByLesson(lessonId));
    } else {
      alert("No lesson ID provided. Redirecting to lessons page.");
      navigate("/learning");
    }
  }, [lessonId, dispatch, navigate]);

  useEffect(() => {}, [lesson]);

  // Check if lesson has loaded properly with resources
  if (!lesson || !lesson.resources) {
    return null;
  }

  return (
    <>
      <NavBar />
      <div className={styles.pageContainer}>
        <AdvancedContainer lesson={lesson} />
      </div>
      <Footer />
    </>
  );
};

export default AdvanceLearningPage;
