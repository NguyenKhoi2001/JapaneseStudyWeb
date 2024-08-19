import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileImage,
  faTimesCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./css/VocabularyForm.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  createVocabulary,
  updateVocabulary,
} from "../../../../services/vocabulary/vocabularySlice";
import ErrorAlert from "../../../../components/ErrorAlert";
import SuccessAlert from "../../../../components/SuccessAlert";
import LoadingPage from "../../../../pages/LoadingPage";
import CustomImage from "../../../../components/CustomImage";
import {
  fetchResourceByLesson,
  modifyLessonItems,
} from "../../../../services/lesson/lessonSlice";
import fileToBase64 from "../../../../utils/FileReaderBase64";

const VocabularyForm = ({
  onClose,
  formDataInit = {},
  lessonId,
  formType = "add",
}) => {
  const { t } = useTranslation("advanceLearning");
  const dispatch = useDispatch();

  const defaultFormData = useMemo(
    () => ({
      hiraganaKatakana: "",
      kanji: "",
      meanings: { en: "", vi: "" },
      sinoVietnameseSounds: "",
      imageUrl: "",
      imagePublicId: "",
      examples: [{ sentence: "", meaning: { en: "", vi: "" } }],
    }),
    []
  );

  const [formData, setFormData] = useState({ ...defaultFormData });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(formDataInit.imageUrl || null);
  const [isModified, setIsModified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const formatMeanings = (meanings) => {
      return Array.isArray(meanings) ? meanings.join(", ") : meanings || "";
    };
    setFormData({
      hiraganaKatakana: formDataInit.hiraganaKatakana || "",
      kanji: formDataInit.kanji || "",
      meanings: {
        en: formatMeanings(formDataInit.meanings?.en),
        vi: formatMeanings(formDataInit.meanings?.vi),
      },
      sinoVietnameseSounds: formDataInit.sinoVietnameseSounds || "",
      imageUrl: formDataInit.imageUrl || "",
      imagePublicId: formDataInit.imagePublicId || "",
      examples: formDataInit.examples?.map((ex) => ({
        sentence: ex.sentence,
        meaning: { en: ex.meaning.en, vi: ex.meaning.vi },
      })) || [{ sentence: "", meaning: { en: "", vi: "" } }],
    });
  }, [formDataInit]);

  const checkIsModified = (newFormData) => {
    // Compare newFormData with formDataInit to check for any changes
    const isDifferent = Object.keys(newFormData).some((key) => {
      if (typeof newFormData[key] === "object" && newFormData[key] !== null) {
        return (
          JSON.stringify(newFormData[key]) !== JSON.stringify(formDataInit[key])
        );
      }
      return newFormData[key] !== formDataInit[key];
    });
    const imageIsDifferent = selectedImage !== null;
    setIsModified(isDifferent || imageIsDifferent);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const keys = name.split(".");

    let updatedValue = { ...formData };
    let itemRef = updatedValue;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        itemRef[key] = value;
      } else {
        if (key.includes("[")) {
          const match = key.match(/(\w+)\[(\d+)\]/);
          itemRef = itemRef[match[1]][match[2]];
        } else {
          itemRef = itemRef[key];
        }
      }
    });
    setFormData(updatedValue);
    checkIsModified(updatedValue);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(file);
        setPreviewUrl(reader.result);
        checkIsModified(formData);
      };
      reader.readAsDataURL(file);
    } else {
      console.error("Unsupported file type.");
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(formDataInit.imageUrl || null);
  };

  const addExample = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      examples: [
        ...prevFormData.examples,
        { sentence: "", meaning: { en: "", vi: "" } }, // new empty example
      ],
    }));
  };

  // Helper function to convert string or array to trimmed array
  const convertToTrimmedArray = (input) => {
    if (Array.isArray(input)) {
      return input.map((item) => item.trim());
    }
    return input.split(",").map((item) => item.trim());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isModified) {
      setError("No changes made to submit.");
      setShowError(true);
      return;
    }
    setLoading(true); // Start loading

    // Convert meanings and examples into arrays
    const preparedFormData = {
      ...formData,
      meanings: {
        en: convertToTrimmedArray(formData.meanings.en),
        vi: convertToTrimmedArray(formData.meanings.vi),
      },
      examples: formData.examples.map((ex) => ({
        sentence: ex.sentence,
        meaning: {
          en: ex.meaning.en,
          vi: ex.meaning.vi,
        },
      })),
    };

    // Filter out examples with empty sentences
    const filteredExamples = preparedFormData.examples.filter(
      (example) => example.sentence.trim() !== ""
    );

    preparedFormData.examples = filteredExamples;

    if (selectedImage) {
      const base64Image = await fileToBase64(selectedImage);
      preparedFormData.imageFile = base64Image; // Adding the image as a Base64 string
    }
    try {
      if (formType === "add") {
        const newVocab = await dispatch(
          createVocabulary(preparedFormData)
        ).unwrap();
        // After adding, link the new vocabulary to the lesson
        await dispatch(
          modifyLessonItems({
            id: lessonId,
            add: { vocabularies: [newVocab._id] },
            remove: {},
          })
        ).unwrap();
      } else {
        // 'update' form type
        await dispatch(
          updateVocabulary({
            id: formDataInit._id,
            updates: preparedFormData,
          })
        ).unwrap();
      }
      setSuccessMessage("Submission successful!");
      setShowSuccess(true);

      // Dispatch fetchResourceByLesson to update lesson data
      if (lessonId) {
        try {
          await dispatch(fetchResourceByLesson(lessonId)).unwrap();
        } catch (fetchError) {
          console.error("Resource fetch error:", fetchError);
        }
      }

      onClose(); // Close the form only if the submission was successful
    } catch (error) {
      setError("Failed to submit form: " + error.message);
      setShowError(true);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className={styles.overlay}>
      {loading && <LoadingPage opacity={0.7} />}
      <div className={styles.container}>
        <button className={styles.closeFormButton} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className={styles.column}>
          <h2 className={styles.centerText}>
            {t("advancedLearning.vocabulary.VocabularyForm.mainImage")}
          </h2>
          <div className={styles.imageSection}>
            <div className={styles.mediaUploader}>
              {previewUrl ? (
                <CustomImage
                  src={previewUrl}
                  alt={t(
                    "advancedLearning.vocabulary.vocabularySlider.Preview"
                  )}
                  className={styles.imagePreview}
                  translationFilename="advanceLearning"
                />
              ) : (
                <div className={styles.dzMessage}>
                  <FontAwesomeIcon icon={faFileImage} size="3x" />
                  <p>
                    {t("advancedLearning.vocabulary.VocabularyForm.dragDrop")}
                  </p>
                </div>
              )}
              <input
                type="file"
                className={styles.fileInput}
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            {selectedImage && (
              <div className={styles.closeButtonContainer}>
                <button
                  className={styles.closeButton}
                  onClick={handleRemoveImage}
                >
                  <FontAwesomeIcon icon={faTimesCircle} />
                  {t("advancedLearning.vocabulary.VocabularyForm.removeImage")}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={styles.column}>
          <h2 className={styles.centerText}>
            {t("advancedLearning.vocabulary.VocabularyForm.details")}
          </h2>
          <hr />
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formSection}>
              <div className={styles.inputContainer}>
                <label className={styles.label}>
                  {t(
                    "advancedLearning.vocabulary.VocabularyForm.hiraganaKatakana"
                  )}
                </label>
                <input
                  type="text"
                  name="hiraganaKatakana"
                  className={styles.input}
                  placeholder={t(
                    "advancedLearning.vocabulary.VocabularyForm.hiraganaKatakana"
                  )}
                  onChange={handleInputChange}
                  value={formData.hiraganaKatakana}
                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>
                  {t("advancedLearning.vocabulary.VocabularyForm.kanji")}
                </label>
                <input
                  type="text"
                  name="kanji"
                  className={styles.input}
                  placeholder={t(
                    "advancedLearning.vocabulary.VocabularyForm.kanji"
                  )}
                  onChange={handleInputChange}
                  value={formData.kanji}
                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>
                  {t("advancedLearning.vocabulary.VocabularyForm.meanings.en")}
                </label>
                <input
                  type="text"
                  name="meanings.en"
                  className={styles.input}
                  placeholder={t(
                    "advancedLearning.vocabulary.VocabularyForm.meanings.en"
                  )}
                  onChange={handleInputChange}
                  value={formData.meanings.en}
                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>
                  {t("advancedLearning.vocabulary.VocabularyForm.meanings.vi")}
                </label>
                <input
                  type="text"
                  name="meanings.vi"
                  className={styles.input}
                  placeholder={t(
                    "advancedLearning.vocabulary.VocabularyForm.meanings.vi"
                  )}
                  onChange={handleInputChange}
                  value={formData.meanings.vi}
                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>
                  {t(
                    "advancedLearning.vocabulary.VocabularyForm.sinoVietnameseSounds"
                  )}
                </label>
                <input
                  type="text"
                  name="sinoVietnameseSounds"
                  className={styles.input}
                  placeholder={t(
                    "advancedLearning.vocabulary.VocabularyForm.sinoVietnameseSounds"
                  )}
                  onChange={handleInputChange}
                  value={formData.sinoVietnameseSounds}
                />
              </div>
            </div>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                {formType === "add"
                  ? t(
                      "advancedLearning.vocabulary.VocabularyForm.addMoreExamples"
                    )
                  : t(
                      "advancedLearning.vocabulary.VocabularyForm.examplesTitle"
                    )}
              </h3>
              {formData.examples.map((ex, index) => (
                <div
                  className={`${styles.exampleContainer} ${styles.fullWidth}`}
                  key={`example-${index}`}
                >
                  <div
                    className={`${styles.inputContainer} ${styles.fullWidth}`}
                  >
                    <label className={`${styles.label} ${styles.exampleLabel}`}>
                      {t(
                        "advancedLearning.vocabulary.VocabularyForm.examples.sentence"
                      )}
                    </label>
                    <input
                      type="text"
                      name={`examples[${index}].sentence`}
                      className={`${styles.input} ${styles.exampleInput}`}
                      placeholder={t(
                        "advancedLearning.vocabulary.VocabularyForm.examples.sentence"
                      )}
                      onChange={handleInputChange}
                      value={ex.sentence}
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label className={`${styles.label} ${styles.exampleLabel}`}>
                      {t(
                        "advancedLearning.vocabulary.VocabularyForm.examples.meaning.en"
                      )}
                    </label>
                    <input
                      type="text"
                      name={`examples[${index}].meaning.en`}
                      className={`${styles.input} ${styles.exampleInput}`}
                      placeholder={t(
                        "advancedLearning.vocabulary.VocabularyForm.examples.meaning.en"
                      )}
                      onChange={handleInputChange}
                      value={ex.meaning.en}
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label className={`${styles.label} ${styles.exampleLabel}`}>
                      {t(
                        "advancedLearning.vocabulary.VocabularyForm.examples.meaning.vi"
                      )}
                    </label>
                    <input
                      type="text"
                      name={`examples[${index}].meaning.vi`}
                      className={`${styles.input} ${styles.exampleInput}`}
                      placeholder={t(
                        "advancedLearning.vocabulary.VocabularyForm.examples.meaning.vi"
                      )}
                      onChange={handleInputChange}
                      value={ex.meaning.vi}
                    />
                  </div>
                </div>
              ))}
              <div className={styles.fullWidth}>
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={addExample}
                >
                  {t("advancedLearning.vocabulary.VocabularyForm.addExample")}
                </button>
              </div>
            </div>
            <div className={styles.fullWidth}>
              <button
                type="submit"
                className={`${styles.submitButton} ${
                  !isModified && styles.disabledButton
                }`}
                disabled={!isModified}
              >
                {t("advancedLearning.vocabulary.VocabularyForm.submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
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

export default VocabularyForm;
