import React, { useState, useEffect } from "react";
import KanjiCardFlipable from "./KanjiCardFlipable";
import KanjiCardNonFlipable from "./KanjiCardNonFlipable";
import AdminControllerContainer from "../AdminControllerContainer";

import styles from "./css/KanjiCardSlider.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import KanjiForm from "./KanjiForm";
import {
  deleteKanji,
  fetchKanjis,
} from "../../../../services/kanji/kanjiSlice";
import { modifyLessonItems } from "../../../../services/lesson/lessonSlice";
import { fetchResourceByLesson } from "../../../../services/lesson/lessonSlice";

import ConfirmAlert from "../../../../components/ConfirmAlert";

const KanjiCardSlider = ({ kanjis = [], lessonId }) => {
  const { t, i18n } = useTranslation("advanceLearning");
  const dispatch = useDispatch();
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [isFlipable, setIsFlipable] = useState(true); // State to toggle between flipable and non-flipable cards

  const [slidesData, setSlidesData] = useState(kanjis);
  useEffect(() => {
    setSlidesData(kanjis);
  }, [kanjis]);

  const max = slidesData.length;

  useEffect(() => {
    dispatch(fetchKanjis());
  }, [dispatch]);

  const roles = useSelector((state) => state.user.currentUserData.roles);
  const [showForm, setShowForm] = useState(false);
  const [formProps, setFormProps] = useState({});

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [kanjiToDelete, setKanjiToDelete] = useState(null);

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setActive((current) => (current === max - 1 ? 0 : current + 1));
    }, 3000);
    return () => {
      clearInterval(interval);
      setAutoplay(false);
    };
  }, [autoplay, max]);

  const handleReset = () => {
    setActive(0); // Reset to the first slide
    setAutoplay(false); // Stop autoplay
  };
  const handlePrev = () => {
    setActive(active > 0 ? active - 1 : max - 1);
  };

  const handleNext = () => {
    setActive(active < max - 1 ? active + 1 : 0);
  };

  const toggleAutoplay = () => setAutoplay(!autoplay);

  const toggleCardType = () => setIsFlipable(!isFlipable); // Function to toggle the card type

  const handleOpenForm = (props) => {
    const currentKanji = slidesData[active]; // Fetch the active kanji
    if (props.type === "delete") {
      handleDelete(currentKanji._id);
      return;
    }
    setFormProps({
      ...props,
      data: props.type === "update" ? currentKanji : {},
    });
    setShowForm(true);
  };

  const handleDelete = (kanjiId) => {
    setKanjiToDelete(kanjiId);
    setConfirmVisible(true);
  };
  const confirmDeletion = async () => {
    try {
      await dispatch(deleteKanji(kanjiToDelete)).unwrap();
      await dispatch(
        modifyLessonItems({
          id: lessonId,
          add: {},
          remove: { kanjis: [kanjiToDelete] },
        })
      ).unwrap();
      if (lessonId) {
        await dispatch(fetchResourceByLesson(lessonId)).unwrap();
      }
      setConfirmVisible(false); // Close the confirm dialog after successful deletion
    } catch (error) {
      console.error("Failed to delete kanji:", error);
    }
  };

  const cancelDeletion = () => {
    setConfirmVisible(false);
  };

  return (
    <>
      <div className={styles.sliderContainer}>
        <div className={styles.buttonDiv}>
          <button
            className={`${styles.prevButton} ${
              active === 0 ? styles.hidden : ""
            }`}
            onClick={handlePrev}
          >
            Prev
          </button>
        </div>
        <div className={styles.slider}>
          <div
            className={styles.slidesContainer}
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {slidesData.map((slide, index) => {
              const language = i18n.language;
              const currentMeaning = slide.meaning[language];
              const currentExamples = slide.examples.map((example) => ({
                ...example,
                meaning: example.meaning[language],
              }));
              const modifiedSlide = {
                ...slide,
                meaning: currentMeaning,
                examples: currentExamples,
              };
              return (
                <div key={index} className={styles.slide}>
                  {isFlipable ? (
                    <KanjiCardFlipable {...modifiedSlide} />
                  ) : (
                    <KanjiCardNonFlipable {...modifiedSlide} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.buttonDiv}>
          <button
            className={`${styles.nextButton} ${
              active === max - 1 ? styles.hidden : ""
            }`}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>{" "}
      <div className={styles.controls}>
        <button onClick={handleReset} className={styles.controlButton}>
          {t("advancedLearning.kanji.kanjiSlider.reset")}
        </button>
        <button
          onClick={toggleAutoplay}
          className={styles.controlButton}
          disabled={active === max - 1}
        >
          {autoplay
            ? t("advancedLearning.kanji.kanjiSlider.stopAutoplay")
            : t("advancedLearning.kanji.kanjiSlider.startAutoplay")}
        </button>
        <button onClick={toggleCardType} className={styles.controlButton}>
          {isFlipable
            ? t("advancedLearning.kanji.kanjiSlider.useNonFlipable")
            : t("advancedLearning.kanji.kanjiSlider.useFlipable")}
        </button>
      </div>
      {showForm && (
        <KanjiForm
          onClose={() => setShowForm(false)}
          formDataInit={formProps.data || {}}
          formType={formProps.type}
          lessonId={lessonId}
        />
      )}
      <AdminControllerContainer
        roles={roles}
        currentData={slidesData[active]}
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

export default KanjiCardSlider;
