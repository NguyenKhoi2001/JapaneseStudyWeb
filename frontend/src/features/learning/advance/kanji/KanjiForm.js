import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileImage,
  faTimesCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./css/KanjiForm.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { addKanji, updateKanji } from "../../../../services/kanji/kanjiSlice";
import CustomImage from "../../../../components/CustomImage";
import ErrorAlert from "../../../../components/ErrorAlert";
import SuccessAlert from "../../../../components/SuccessAlert";
import LoadingPage from "../../../../pages/LoadingPage";
import {
  fetchResourceByLesson,
  modifyLessonItems,
} from "../../../../services/lesson/lessonSlice";
import fileToBase64 from "../../../../utils/FileReaderBase64";

const KanjiForm = ({
  onClose,
  formDataInit = {},
  formType = "add",
  lessonId,
}) => {
  const { t } = useTranslation("advanceLearning");
  const dispatch = useDispatch();
  const defaultFormData = useMemo(
    () => ({
      character: "",
      meaning: { jp: "", en: "", vi: "" },
      sinoVietnameseSounds: "",
      onyomi: [],
      kunyomi: [],
      imageUrl: "",
      imagePublicId: "",
      examples: [{ kanjiWord: "", hiragana: "", meaning: { en: "", vi: "" } }],
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
    setFormData({
      character: formDataInit.character || "",
      meaning: {
        jp: formDataInit.meaning?.jp || "",
        en: formDataInit.meaning?.en || "",
        vi: formDataInit.meaning?.vi || "",
      },
      sinoVietnameseSounds: formDataInit.sinoVietnameseSounds || "",
      onyomi: formDataInit.onyomi || [],
      kunyomi: formDataInit.kunyomi || [],
      imageUrl: formDataInit.imageUrl || "",
      imagePublicId: formDataInit.imagePublicId || "",
      examples: formDataInit.examples?.map((ex) => ({
        kanjiWord: ex.kanjiWord || "",
        hiragana: ex.hiragana || "",
        meaning: {
          en: ex.meaning.en || "",
          vi: ex.meaning.vi || "",
        },
      })) || [{ kanjiWord: "", hiragana: "", meaning: { en: "", vi: "" } }],
    });
  }, [formDataInit]);

  useEffect(() => {
    // This effect ensures that if the form is closed without saving, the original image is shown again
    return () => {
      if (formDataInit.imageUrl) {
        setPreviewUrl(formDataInit.imageUrl);
      }
    };
  }, [formDataInit.imageUrl]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      const keys = name.split(".");
      let ref = prevFormData;

      // Navigate to the last key in the name
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key.includes("[")) {
          const [baseKey, index] = key.match(/(\w+)\[(\d+)\]/).slice(1);
          if (!ref[baseKey]) {
            ref[baseKey] = [];
          }
          if (!ref[baseKey][index]) {
            ref[baseKey][index] = {};
          }
          ref = ref[baseKey][index];
        } else {
          if (!ref[key]) {
            ref[key] = {};
          }
          ref = ref[key];
        }
      }

      if (
        keys[keys.length - 1] === "onyomi" ||
        keys[keys.length - 1] === "kunyomi"
      ) {
        ref[keys[keys.length - 1]] = value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== "");
      } else {
        ref[keys[keys.length - 1]] = value;
      }

      // Return a new object to trigger state update
      return { ...prevFormData };
    });
    setIsModified(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(file);
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setIsModified(true);
    } else {
      console.error("Unsupported file type.");
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (formDataInit.imageUrl) {
      setIsModified(true);
    }
  };

  const addExample = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      examples: [
        ...prevFormData.examples,
        { kanjiWord: "", hiragana: "", meaning: { en: "", vi: "" } },
      ],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isModified) {
      setError("No changes made to submit.");
      setShowError(true);
      return;
    }
    setLoading(true);
    setShowError(false);

    // Validate that onyomi and kunyomi are arrays
    if (!Array.isArray(formData.onyomi) || !Array.isArray(formData.kunyomi)) {
      setError("Onyomi or Kunyomi data is corrupt.");
      setShowError(true);
      setLoading(false);
      return;
    }

    const preparedFormData = {
      ...formData,
      onyomi: formData.onyomi.filter((o) => o.trim() !== ""),
      kunyomi: formData.kunyomi.filter((k) => k.trim() !== ""),
      examples: formData.examples.filter((e) => e.kanjiWord.trim() !== ""),
      imageUrl: previewUrl || null,
    };
    if (selectedImage) {
      const base64Image = await fileToBase64(selectedImage);
      preparedFormData.imageFile = base64Image; // Adding the image as a Base64 string
    }
    try {
      let newKanji;
      if (formType === "add") {
        newKanji = await dispatch(addKanji(preparedFormData)).unwrap();
        // Link the new kanji to the lesson
        await dispatch(
          modifyLessonItems({
            id: lessonId,
            add: { kanjis: [newKanji._id] },
            remove: {},
          })
        ).unwrap();
      } else {
        await dispatch(
          updateKanji({
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
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
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
            {t("advancedLearning.kanji.KanjiForm.mainImage")}
          </h2>
          <div className={styles.imageSection}>
            <div className={styles.mediaUploader}>
              {previewUrl ? (
                <CustomImage
                  src={previewUrl}
                  alt={t("advancedLearning.kanji.KanjiForm.Preview")}
                  className={styles.imagePreview}
                  translationFilename="advanceLearning"
                />
              ) : (
                <div className={styles.dzMessage}>
                  <FontAwesomeIcon icon={faFileImage} size="3x" />
                  <p>{t("advancedLearning.kanji.KanjiForm.dragDrop")}</p>
                </div>
              )}
              <input
                type="file"
                className={styles.fileInput}
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            {previewUrl && (
              <div className={styles.closeButtonContainer}>
                <button
                  className={styles.closeButton}
                  onClick={handleRemoveImage}
                >
                  <FontAwesomeIcon icon={faTimesCircle} />
                  {t("advancedLearning.kanji.KanjiForm.removeImage")}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={styles.column}>
          <h2 className={styles.centerText}>
            {t("advancedLearning.kanji.KanjiForm.details")}
          </h2>
          <hr />
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formSection}>
              <div className={styles.inputContainer}>
                <label className={styles.label}>
                  {t("advancedLearning.kanji.KanjiForm.character")}
                </label>
                <input
                  type="text"
                  name="character"
                  className={styles.input}
                  placeholder={t(
                    "advancedLearning.kanji.KanjiForm.characterPlaceholder"
                  )}
                  onChange={handleInputChange}
                  value={formData.character}
                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>
                  {t("advancedLearning.kanji.KanjiForm.sinoVietnameseSounds")}
                </label>
                <input
                  type="text"
                  name="sinoVietnameseSounds"
                  className={styles.input}
                  placeholder={t(
                    "advancedLearning.kanji.KanjiForm.sinoVietnameseSoundsPlaceholder"
                  )}
                  onChange={handleInputChange}
                  value={formData.sinoVietnameseSounds}
                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>
                  {t("advancedLearning.kanji.KanjiForm.onyomi")}
                </label>
                <input
                  type="text"
                  name="onyomi"
                  className={styles.input}
                  placeholder={t(
                    "advancedLearning.kanji.KanjiForm.onyomiPlaceholder"
                  )}
                  onChange={handleInputChange}
                  value={formData.onyomi}
                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>
                  {t("advancedLearning.kanji.KanjiForm.kunyomi")}
                </label>
                <input
                  type="text"
                  name="kunyomi"
                  className={styles.input}
                  placeholder={t(
                    "advancedLearning.kanji.KanjiForm.kunyomiPlaceholder"
                  )}
                  onChange={handleInputChange}
                  value={formData.kunyomi}
                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>
                  {t("advancedLearning.kanji.KanjiForm.meanings.en")}
                </label>
                <input
                  type="text"
                  name="meaning.en"
                  className={styles.input}
                  placeholder={t(
                    "advancedLearning.kanji.KanjiForm.meanings.en"
                  )}
                  onChange={handleInputChange}
                  value={formData.meaning.en}
                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>
                  {t("advancedLearning.kanji.KanjiForm.meanings.vi")}
                </label>
                <input
                  type="text"
                  name="meaning.vi"
                  className={styles.input}
                  placeholder={t(
                    "advancedLearning.kanji.KanjiForm.meanings.vi"
                  )}
                  onChange={handleInputChange}
                  value={formData.meaning.vi}
                />
              </div>
            </div>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                {formType === "add"
                  ? t("advancedLearning.kanji.KanjiForm.addMoreExamples")
                  : t("advancedLearning.kanji.KanjiForm.examplesTitle")}
              </h3>
              <div className={styles.singleExampleContainer}>
                {formData.examples.map((ex, index) => (
                  <div className={styles.exampleInputGrid} key={index}>
                    <div className={styles.exampleInputContainer}>
                      <label className={styles.exampleLabel}>
                        {t(
                          "advancedLearning.kanji.KanjiForm.examples.kanjiWord"
                        )}
                      </label>
                      <input
                        type="text"
                        name={`examples[${index}].kanjiWord`}
                        className={styles.exampleInput}
                        placeholder={t(
                          "advancedLearning.kanji.KanjiForm.examples.kanjiWord"
                        )}
                        onChange={handleInputChange}
                        value={ex.kanjiWord}
                      />
                    </div>
                    <div className={styles.exampleInputContainer}>
                      <label className={styles.exampleLabel}>
                        {t(
                          "advancedLearning.kanji.KanjiForm.examples.hiragana"
                        )}
                      </label>
                      <input
                        type="text"
                        name={`examples[${index}].hiragana`}
                        className={styles.exampleInput}
                        placeholder={t(
                          "advancedLearning.kanji.KanjiForm.examples.hiragana"
                        )}
                        onChange={handleInputChange}
                        value={ex.hiragana}
                      />
                    </div>
                    <div className={styles.exampleInputContainer}>
                      <label className={styles.exampleLabel}>
                        {t(
                          "advancedLearning.kanji.KanjiForm.examples.meaning.en"
                        )}
                      </label>
                      <input
                        type="text"
                        name={`examples[${index}].meaning.en`}
                        className={styles.exampleInput}
                        placeholder={t(
                          "advancedLearning.kanji.KanjiForm.examples.meaning.en"
                        )}
                        onChange={handleInputChange}
                        value={ex.meaning.en}
                      />
                    </div>
                    <div className={styles.exampleInputContainer}>
                      <label className={styles.exampleLabel}>
                        {t(
                          "advancedLearning.kanji.KanjiForm.examples.meaning.vi"
                        )}
                      </label>
                      <input
                        type="text"
                        name={`examples[${index}].meaning.vi`}
                        className={styles.exampleInput}
                        placeholder={t(
                          "advancedLearning.kanji.KanjiForm.examples.meaning.vi"
                        )}
                        onChange={handleInputChange}
                        value={ex.meaning.vi}
                      />
                    </div>
                    <br></br>
                  </div>
                ))}
              </div>

              <div className={styles.fullWidth}>
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={addExample}
                >
                  {t("advancedLearning.kanji.KanjiForm.addExample")}
                </button>
              </div>
            </div>
            <div className={styles.fullWidth}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={!isModified}
              >
                {t("advancedLearning.kanji.KanjiForm.submit")}
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

export default KanjiForm;
