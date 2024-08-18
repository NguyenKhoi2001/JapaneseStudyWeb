import React, { useState, useEffect } from "react";
import VocabularyCardFlipable from "./VocabularyCardFlipable";
import VocabularyCardNonFlipable from "./VocabularyCardNonFlipable";
import styles from "./css/VocabularyCardSlider.module.css";
import { useTranslation } from "react-i18next";
import AdminControllerContainer from "../AdminControllerContainer";
import { useDispatch, useSelector } from "react-redux";
import VocabularyForm from "./VocabularyForm";
import { removeVocabulary } from "../../../../services/vocabulary/vocabularySlice";
import { modifyLessonItems } from "../../../../services/lesson/lessonSlice";
import { fetchResourceByLesson } from "../../../../services/lesson/lessonSlice";
import ConfirmAlert from "../../../../components/ConfirmAlert";
// import { fetchAllVocabularies } from "../../../../services/vocabulary/vocabularySlice";

const VocabularyCardSlider = ({ vocabularies = [], lessonId }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("advanceLearning");
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [isFlipable, setIsFlipable] = useState(true);

  const [slidesData, setSlidesData] = useState(vocabularies);
  useEffect(() => {
    setSlidesData(vocabularies);
  }, [vocabularies]);

  const max = slidesData.length;

  const roles = useSelector((state) => state.user.currentUserData.roles);
  const [showForm, setShowForm] = useState(false);
  const [formProps, setFormProps] = useState({});
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [vocabularyToDelete, setVocabularyToDelete] = useState(null);

  useEffect(() => {
    let interval;
    if (autoplay && active < max - 1) {
      interval = setInterval(() => {
        setActive((current) => current + 1);
      }, 3000);
    } else if (autoplay && active === max - 1) {
      clearInterval(interval);
      setAutoplay(false); // Automatically stop autoplay when last slide is reached
    }
    return () => clearInterval(interval);
  }, [autoplay, active, max]);

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

  const toggleCardType = () => setIsFlipable(!isFlipable);

  const confirmDeletion = async () => {
    try {
      await dispatch(removeVocabulary(vocabularyToDelete)).unwrap();
      await dispatch(
        modifyLessonItems({
          id: lessonId,
          add: {},
          remove: { vocabularies: [vocabularyToDelete] },
        })
      ).unwrap();
      if (lessonId) {
        await dispatch(fetchResourceByLesson(lessonId)).unwrap();
      }
      setConfirmVisible(false); // Close the confirm dialog
    } catch (error) {
      console.error("Failed to delete vocabulary:", error);
    }
  };

  const cancelDeletion = () => {
    setConfirmVisible(false);
  };

  const handleDelete = (vocabularyId) => {
    setVocabularyToDelete(vocabularyId);
    setConfirmVisible(true);
  };

  const handleOpenForm = (props) => {
    const currentVocabulary = slidesData[active];
    if (props.type === "delete") {
      handleDelete(currentVocabulary._id);
      return;
    }
    setFormProps({
      ...props,
      data: props.type === "update" ? currentVocabulary : {},
    });
    setShowForm(true);
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
            {t("advancedLearning.vocabulary.vocabularySlider.prevButton")}
          </button>
        </div>
        <div className={styles.slider}>
          <div
            className={styles.slidesContainer}
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {slidesData.map((slide, index) => {
              const language = i18n.language;
              // Extract only English meanings for both vocabulary and example sentences
              const currentMeanings = slide.meanings[language]
                ? slide.meanings[language].join(", ")
                : null;
              const modifiedSlide = {
                ...slide,
                meanings: currentMeanings,
                examples: slide.examples.map((example) => ({
                  ...example,
                  meaning: example.meaning[language] || null,
                })),
              };
              return (
                <div key={index} className={styles.slide}>
                  {isFlipable ? (
                    <VocabularyCardFlipable {...modifiedSlide} />
                  ) : (
                    <VocabularyCardNonFlipable {...modifiedSlide} />
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
            {t("advancedLearning.vocabulary.vocabularySlider.nextButton")}
          </button>
        </div>
      </div>
      <div className={styles.controls}>
        <button onClick={handleReset} className={styles.controlButton}>
          {t("advancedLearning.vocabulary.vocabularySlider.reset")}
        </button>
        <button
          onClick={toggleAutoplay}
          className={styles.controlButton}
          disabled={active === max - 1}
        >
          {autoplay
            ? t("advancedLearning.vocabulary.vocabularySlider.stopAutoplay")
            : t("advancedLearning.vocabulary.vocabularySlider.startAutoplay")}
        </button>
        <button onClick={toggleCardType} className={styles.controlButton}>
          {isFlipable
            ? t("advancedLearning.vocabulary.vocabularySlider.useNonFlipable")
            : t("advancedLearning.vocabulary.vocabularySlider.useFlipable")}
        </button>
      </div>
      {showForm && (
        <VocabularyForm
          onClose={() => setShowForm(false)}
          formDataInit={formProps.data || {}}
          lessonId={lessonId}
          formType={formProps.type}
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

export default VocabularyCardSlider;
