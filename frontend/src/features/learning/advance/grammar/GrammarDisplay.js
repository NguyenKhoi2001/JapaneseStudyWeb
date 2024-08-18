import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import QuillOutputComponent from "./QuillOutputComponent";
import QuillEditorComponent from "./QuillEditorComponent";
import { useDispatch, useSelector } from "react-redux";

import styles from "./css/GrammarDisplay.module.css";
import {
  addGrammar,
  deleteGrammar,
  updateGrammar,
} from "../../../../services/grammar/grammarSlice";
import LoadingPage from "../../../../pages/LoadingPage";
import SuccessAlert from "../../../../components/SuccessAlert";
import ErrorAlert from "../../../../components/ErrorAlert";
import {
  fetchResourceByLesson,
  modifyLessonItems,
} from "../../../../services/lesson/lessonSlice";

// Setting the defaultGrammar as empty
const emptyGrammar = {
  en: { title: "", htmlContent: "" },
  vi: { title: "", htmlContent: "" },
  jp: { title: "", htmlContent: "" },
};

const GrammarDisplay = ({ grammars, lessonId }) => {
  const { t, i18n } = useTranslation("advanceLearning");
  const dispatch = useDispatch();

  //initialize there is current grammar
  const [selectedGrammar, setSelectedGrammar] = useState(
    grammars && grammars.length > 0 ? grammars[0] : emptyGrammar
  );

  //rerender base on passed grammars
  useEffect(() => {
    if (grammars && grammars.length > 0) {
      setSelectedGrammar(grammars[0]);
    } else {
      setSelectedGrammar(emptyGrammar);
    }
  }, [grammars]);

  //set initial grammarData and load base on user language chosen
  const [grammarData, setGrammarData] = useState(
    selectedGrammar[i18n.language]
  );

  const [editorLanguage, setEditorLanguage] = useState(i18n.language);
  const [editedGrammarData, setEditedGrammarData] = useState(selectedGrammar);

  useEffect(() => {
    // Ensure the grammarData is updated only when i18n.language changes
    setGrammarData(selectedGrammar[i18n.language]);
    //close editor when change language too
    setShowEditor(false);
    setEditedGrammarData(selectedGrammar);
  }, [selectedGrammar, i18n.language]);

  //check changes here
  const [isModified, setIsModified] = useState(false);
  const { currentUserData } = useSelector((state) => state.user);
  const { userId } = currentUserData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleContentChange = useCallback(
    (newHtml) => {
      setEditedGrammarData((prevData) => ({
        ...prevData,
        [editorLanguage]: { ...prevData[editorLanguage], htmlContent: newHtml },
      }));
      setIsModified(true);
    },
    [editorLanguage]
  );

  const handleTitleChange = useCallback(
    (event) => {
      const newTitle = event.target.value;
      setEditedGrammarData((prevData) => ({
        ...prevData,
        [editorLanguage]: { ...prevData[editorLanguage], title: newTitle },
      }));
      setIsModified(true);
    },
    [editorLanguage]
  );

  const handleLanguageSelectionChange = useCallback((event) => {
    setEditorLanguage(event.target.value);
    setIsModified(false);
  }, []);

  const handleSaveGrammar = async () => {
    setLoading(true);
    setShowError(false);
    setShowSuccess(false);

    if (!isModified) {
      setShowError(t("advancedLearning.grammar.grammarDisplay.noModified"));
    }

    //body to add/update
    const updates = {
      ...editedGrammarData,
      [editorLanguage]: {
        title: editedGrammarData[editorLanguage].title,
        htmlContent: editedGrammarData[editorLanguage].htmlContent,
      },
    };

    let result;
    try {
      // Check if Vietnamese title and content is empty Then this should add to database
      if (
        !(selectedGrammar.vi.title || selectedGrammar.vi.htmlContent) &&
        editorLanguage === "vi"
      ) {
        // Add new grammar
        result = await dispatch(addGrammar(updates)).unwrap();
        await dispatch(
          modifyLessonItems({
            id: lessonId,
            add: { grammars: [result._id] },
            remove: {},
          })
        ).unwrap();
      } else if (
        !(selectedGrammar.vi.title || selectedGrammar.vi.htmlContent) &&
        editorLanguage !== "vi"
      ) {
        setError(
          t("advancedLearning.grammar.grammarDisplay.mustCreateVietnameseFirst")
        );
        setShowError(true);
        setLoading(false);

        return;
      } else {
        // Update existing grammar
        result = await dispatch(
          updateGrammar({ id: selectedGrammar._id, updates })
        ).unwrap();
      }
      setSuccessMessage(
        t("advancedLearning.grammar.grammarDisplay.updateSuccessful")
      );
      setIsModified(false);
      setShowEditor(false);
    } catch (error) {
      console.error(error);
      setError(
        t("advancedLearning.grammar.grammarDisplay.updateFailed") +
          { error: error.message || error }
      );
      setShowError(true);
    } finally {
      await dispatch(fetchResourceByLesson(lessonId));
      setLoading(false);
    }
  };

  const handleDeleteGrammar = async () => {
    if (
      !selectedGrammar ||
      !window.confirm(
        t("advancedLearning.grammar.grammarDisplay.confirmDelete")
      )
    )
      return;

    setLoading(true);
    try {
      const updates = { ...selectedGrammar };
      if (i18n.language === "vi") {
        // Delete the entire grammar if it's Vietnamese
        await dispatch(deleteGrammar(selectedGrammar._id)).unwrap();
      } else {
        // Clear the specific language content
        updates[i18n.language] = { title: "", htmlContent: "" };
        await dispatch(
          updateGrammar({ id: selectedGrammar._id, updates })
        ).unwrap();
      }
      setSuccessMessage(
        t("advancedLearning.grammar.grammarDisplay.deleteSuccessful")
      );
      setShowSuccess(true);
      setShowEditor(false);
      await dispatch(fetchResourceByLesson(lessonId));
    } catch (error) {
      console.error(error);
      setError(
        t("advancedLearning.grammar.grammarDisplay.deleteFailed") +
          { error: error.message || error }
      );
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // Memoize content and title based on i18n.language
  const { content, title } = useMemo(
    () => ({
      content: grammarData?.htmlContent,
      title: grammarData?.title,
    }),
    [grammarData]
  );

  const { titleForEditor, contentForEditor } = useMemo(
    () => ({
      titleForEditor: editedGrammarData[editorLanguage]?.title,
      contentForEditor: editedGrammarData[editorLanguage]?.htmlContent,
    }),
    [editedGrammarData, editorLanguage]
  );

  const showEditForm = () => {
    setShowEditor(true);
    setEditorLanguage(i18n.language);
  };
  return (
    <div className={styles.grammarContainer}>
      {loading && <LoadingPage />}
      {content ? (
        <QuillOutputComponent editorHtml={content} title={title} />
      ) : i18n.language === "vi" ? null : (
        <h2>
          {t("advancedLearning.grammar.grammarDisplay.contentUnavailable")}
        </h2>
      )}
      {userId && (
        <>
          {!(
            selectedGrammar[i18n.language].title ||
            selectedGrammar[i18n.language].htmlContent
          ) && (
            <button
              className={styles.button}
              onClick={() => {
                setShowEditor(true);
                setEditedGrammarData({
                  ...selectedGrammar,
                  [i18n.language]: {
                    title: title || "",
                    htmlContent: content || "",
                  },
                });
                setEditorLanguage(i18n.language);
              }}
            >
              {t("advancedLearning.grammar.grammarDisplay.addGrammar")}
            </button>
          )}
          {selectedGrammar[i18n.language].title && (
            <>
              <button className={styles.button} onClick={showEditForm}>
                {t("advancedLearning.grammar.grammarDisplay.editContent")}
              </button>
              <button className={styles.button} onClick={handleDeleteGrammar}>
                {t("advancedLearning.grammar.grammarDisplay.deleteGrammar")}
              </button>
            </>
          )}
        </>
      )}

      {showEditor && (
        <>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="titleInput" className={styles.label}>
                {t("advancedLearning.grammar.grammarDisplay.title")}
              </label>
              <input
                type="text"
                id="titleInput"
                value={titleForEditor}
                onChange={handleTitleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="languageSelect" className={styles.label}>
                {t("advancedLearning.grammar.grammarDisplay.language")}
              </label>
              <select
                id="languageSelect"
                value={editorLanguage}
                onChange={handleLanguageSelectionChange}
                className={styles.select}
              >
                <option value="en">
                  {t("advancedLearning.grammar.grammarDisplay.languages.en")}
                </option>
                <option value="vi">
                  {t("advancedLearning.grammar.grammarDisplay.languages.vi")}
                </option>
                <option value="jp">
                  {t("advancedLearning.grammar.grammarDisplay.languages.jp")}
                </option>
              </select>
            </div>
          </div>
          <QuillEditorComponent
            key={editorLanguage}
            setEditorHtml={handleContentChange}
            initialHtml={contentForEditor}
            placeholder={t(
              "advancedLearning.grammar.grammarDisplay.emptyContent"
            )}
          />
          <button
            className={styles.button}
            onClick={handleSaveGrammar}
            disabled={!isModified}
          >
            {selectedGrammar
              ? t(
                  "advancedLearning.grammar.grammarDisplay.updateGrammarContent"
                )
              : t("advancedLearning.grammar.grammarDisplay.addGrammarContent")}
          </button>
        </>
      )}
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

export default GrammarDisplay;
