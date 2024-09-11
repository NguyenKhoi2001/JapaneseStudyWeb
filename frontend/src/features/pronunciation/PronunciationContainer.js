import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadAudio,
  setAudioFile,
} from "../../services/pronunciation/pronunciationSlice";
import styles from "./css/PronunciationContainer.module.css";
import { useTranslation } from "react-i18next";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import IconSpeaker from "../../components/IconSpeaker";
import LoadingPage from "../../pages/LoadingPage";
import SuccessAlert from "../../components/SuccessAlert";
import ErrorAlert from "../../components/ErrorAlert";

const japaneseSentences = [
  "こんにちは。",
  "ありがとう。",
  "すみません。",
  "こんばんは。",
  "おはようございます。",
  "さようなら。",
  "はい、わかりました。",
  "いいえ、大丈夫です。",
  "お元気ですか？",
  "お疲れ様です。",
  "おめでとうございます。",
  "行ってきます。",
  "ただいま。",
  "ごめんなさい。",
  "どうぞよろしく。",
  "お願いします。",
  "いらっしゃいませ。",
  "いただきます。",
  "ごちそうさまでした。",
  "気をつけてください。",
  "よろしくお願いします。",
  "今日は暑いですね。",
  "今日は寒いですね。",
  "お久しぶりです。",
  "頑張ってください。",
  "どうしましたか？",
  "どこに行きますか？",
  "何をしますか？",
  "楽しいですね。",
  "また会いましょう。",
];

const PronunciationContainer = () => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false); // Success alert state
  const [showError, setShowError] = useState(false); // Error alert state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [originalText, setOriginalText] = useState(japaneseSentences[0]);

  const [stream, setStream] = useState(null); // Store the stream in state
  const audioBlobRef = useRef(null); // Store the Blob locally in a ref (non-serializable)
  const dispatch = useDispatch();
  const { uploadStatus, error, transcript } = useSelector(
    (state) => state.pronunciation
  );
  const ffmpeg = new FFmpeg({ log: true }); // Instantiate FFmpeg

  const handleStartRecording = async () => {
    if (isRecording) return;

    // Clear previous audioURL
    setAudioURL(null);

    // Request access to the microphone
    const newStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    setStream(newStream); // Save the stream to state

    const newRecorder = new MediaRecorder(newStream);
    const localChunks = []; // Use a local variable to store the chunks

    newRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        localChunks.push(event.data); // Push data to the local array
      }
    };

    newRecorder.onstop = async () => {
      if (localChunks.length > 0) {
        const audioBlob = new Blob(localChunks, { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        await convertAudio(audioBlob);

        // Dispatch the action to store only the audio URL in Redux state
        dispatch(setAudioFile({ audioURL: audioUrl }));
      } else {
        console.error(t("pronunciation.error.noAudioError"));
      }
    };

    setRecorder(newRecorder);
    setIsRecording(true);
    newRecorder.start();
  };

  const handleStopRecording = () => {
    if (!isRecording || !recorder) return;

    recorder.stop();
    setIsRecording(false);

    // Stop all tracks of the stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null); // Clear the stream from state
    }
  };

  const handleRecordButtonClick = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const convertAudio = async (audioBlob) => {
    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }

    const audioFileName = "audio.mp3";
    const outputFileName = "output.mp3";

    await ffmpeg.writeFile(audioFileName, await fetchFile(audioBlob));

    // Convert the audio file using FFmpeg
    await ffmpeg.exec(["-i", audioFileName, "-b:a", "124k", outputFileName]);

    const data = await ffmpeg.readFile(outputFileName);
    const convertedBlob = new Blob([data.buffer], { type: "audio/mp3" });

    // Save the converted blob so we can upload it later
    audioBlobRef.current = convertedBlob;

    // Set the URL of the converted audio for preview or download
    const convertedURL = URL.createObjectURL(convertedBlob);
    setAudioURL(convertedURL);
  };

  const handleUploadClick = async () => {
    const audioBlob = audioBlobRef.current;
    if (audioBlob) {
      setIsLoading(true);
      try {
        await dispatch(uploadAudio(audioBlob));
        setShowSuccess(true);
      } catch (err) {
        setShowError(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error(t("pronunciation.error.noFileForUpload"));
    }
  };

  //   const handleDownloadClick = () => {
  //     const audioBlob = audioBlobRef.current;
  //     if (audioBlob) {
  //       const url = URL.createObjectURL(audioBlob);
  //       const a = document.createElement("a");
  //       a.style.display = "none";
  //       a.href = audioURL;
  //       a.download = "pronunciation_124kbps.mp3";
  //       document.body.appendChild(a);
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //     }
  //   };

  const compareTexts = (originalText, newText = "") => {
    // Trim extra whitespace from the original and new text
    originalText = originalText.trim();
    newText = newText.trim() || "";

    let result = [];
    let i = 0,
      j = 0;

    let totalGreen = 0; // Correctly matched characters (green)
    let totalRed = 0; // Incorrect or missing characters (red)
    let totalCharacters = 0; // Total relevant characters (excluding "。")

    let groupAdded = "";
    let groupMissing = "";

    while (i < originalText.length && j < newText.length) {
      if (originalText[i] === newText[j]) {
        if (originalText[i] !== "。") {
          totalGreen++; // Count matched characters (excluding "。")
        }

        // Push any grouped missing characters before a match
        if (groupMissing) {
          result.push(
            <>
              <span key={`space-before-missing-${i}`}>&nbsp;</span>
              <span key={`missing-group-${i}`} className={styles.missing}>
                {groupMissing}
              </span>
              <span key={`space-after-missing-${i}`}>&nbsp;</span>
            </>
          );
          groupMissing = ""; // Clear the group after rendering
        }

        // Push any grouped added characters before a match
        if (groupAdded) {
          result.push(
            <>
              <span key={`space-before-added-${j}`}>&nbsp;</span>
              <span key={`added-group-${j}`} className={styles.added}>
                {groupAdded}
              </span>
              <span key={`space-after-added-${j}`}>&nbsp;</span>
            </>
          );
          groupAdded = ""; // Clear the group after rendering
        }

        // Matching character, highlight in green
        result.push(
          <span key={`same-${i}`} className={styles.match}>
            {originalText[i]}
          </span>
        );
        i++;
        j++;
      } else {
        // If the current character in newText is extra, add it to the groupAdded
        if (!originalText.includes(newText[j], i)) {
          if (newText[j] !== "。") {
            totalRed++; // Count incorrect characters (excluding "。")
          }
          groupAdded += newText[j];
          j++;
        } else {
          // If the current character in originalText is missing in newText, add it to groupMissing
          if (originalText[i] !== "。") {
            totalRed++; // Count missing characters (excluding "。")
          }
          groupMissing += originalText[i];
          i++;
        }
      }
    }

    // Handle remaining grouped missing characters in originalText
    if (groupMissing) {
      result.push(
        <>
          <span key={`space-before-missing-final`}>&nbsp;</span>
          <span key={`missing-group-final`} className={styles.missing}>
            {groupMissing}
          </span>
          <span key={`space-after-missing-final`}>&nbsp;</span>
        </>
      );
    }

    // Handle remaining grouped added characters in newText
    if (groupAdded) {
      result.push(
        <>
          <span key={`space-before-added-final`}>&nbsp;</span>
          <span key={`added-group-final`} className={styles.added}>
            {groupAdded}
          </span>
          <span key={`space-after-added-final`}>&nbsp;</span>
        </>
      );
    }

    // Handle remaining missing characters in originalText
    while (i < originalText.length) {
      if (originalText[i] !== "。") {
        totalRed++;
      }
      result.push(
        <>
          <span key={`space-before-missing-${i}`}>&nbsp;</span>
          <span key={`missing-${i}`} className={styles.missing}>
            {originalText[i]}
          </span>
          <span key={`space-after-missing-${i}`}>&nbsp;</span>
        </>
      );
      i++;
    }

    // Handle remaining added characters in newText
    while (j < newText.length) {
      if (newText[j] !== "。") {
        totalRed++;
      }
      result.push(
        <>
          <span key={`space-before-added-${j}`}>&nbsp;</span>
          <span key={`added-${j}`} className={styles.added}>
            {newText[j]}
          </span>
          <span key={`space-after-added-${j}`}>&nbsp;</span>
        </>
      );
      j++;
    }

    // Calculate the percentage of correctly matched characters
    totalCharacters = totalGreen + totalRed;
    const percentage =
      totalCharacters > 0 ? (totalGreen / totalCharacters) * 100 : 0;

    return {
      resultCompareText: result, // Assign the result array here
      percentageCompareText: Math.round(percentage), // Rounded percentage of correct matches
    };
  };

  const { resultCompareText, percentageCompareText } = compareTexts(
    originalText,
    transcript || ""
  );

  // Function to set random Japanese sentence as originalText
  const handleRandomText = () => {
    const randomIndex = Math.floor(Math.random() * japaneseSentences.length);
    setOriginalText(japaneseSentences[randomIndex]);
  };
  return (
    <>
      {isLoading && <LoadingPage opacity={0.8} />}
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>{t("pronunciation.title")}</h1>

        <div className={styles.speakingTitle}>
          {t("pronunciation.practiceThisText")}
        </div>
        <div className={styles.japaneseTextContainer}>
          <p className={styles.japaneseText}>{originalText}</p>
          <div className={styles.centerElement}>
            <IconSpeaker text={originalText} className={styles.iconButton} />
            <button className={styles.uploadButton} onClick={handleRandomText}>
              {t("pronunciation.randomText")}
            </button>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={`${styles.recordButton} ${
              isRecording ? styles.recording : ""
            }`}
            onClick={handleRecordButtonClick}
          >
            {isRecording
              ? t("pronunciation.stopRecording")
              : t("pronunciation.record")}
          </button>

          {audioURL && (
            <audio
              src={audioURL}
              controls
              className={styles.audioPlayer}
            ></audio>
          )}

          {audioURL && (
            <button className={styles.uploadButton} onClick={handleUploadClick}>
              {t("pronunciation.uploadAndTranscribe")}
            </button>
          )}

          {/* {audioURL && (
          <button
            className={styles.downloadButton}
            onClick={handleDownloadClick}
          >
            Download 124 kbps MP3
          </button>
        )} */}
          {/* <div> {compareTexts("こんにちは", "こんにちは")}</div>

          <div> {compareTexts("こんにちは", "こんににちは")}</div>
          <div> {compareTexts("こんにちは", "こんちは")}</div>
          <div> {compareTexts("こんにちは", "こんばんは")}</div>
          <div> {compareTexts("こんにちは", "こんばちは")}</div>
          <div> {compareTexts("こんにちは", "こんにちは。お元気ですか")}</div>
          <div>
            {compareTexts("こんにちは、お元気ですか", "こんにちは、元気ですか")}
          </div>
          <div> {compareTexts("こんにちは", "ちはこんに")}</div>

          {uploadStatus === "succeeded" && (
            <div className={styles.transcriptionContainer}>
              <p className={styles.successMessage}>Upload successful!</p>
              <p className={styles.transcriptionText}>
                Transcription: {compareTexts(originalText, transcript.trim())}
              </p>
            </div>
          )} */}
          <div className={styles.gridContainer}>
            <div className={styles.row}>
              <div className={styles.column}>
                <h2 className={styles.columnTitle}>
                  {t("pronunciation.givenText")}
                </h2>
                <p className={styles.originalText}>{originalText}</p>
              </div>

              <div className={styles.column}>
                <h2 className={styles.columnTitle}>
                  {t("pronunciation.yourAnswer")}
                </h2>
                <p className={styles.transcriptText}>
                  {transcript ? transcript : t("pronunciation.noTranscription")}
                </p>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.column}>
                <h2 className={styles.columnTitle}>
                  {t("pronunciation.answerAnalysis")}
                </h2>
                <div className={styles.analysisBox}>{resultCompareText}</div>
              </div>
              <div className={styles.column}>
                <h2 className={styles.columnTitle}>
                  {t("pronunciation.scoring")}
                </h2>

                <div
                  className={
                    percentageCompareText > 60
                      ? styles.greenText
                      : styles.redText
                  }
                >
                  {percentageCompareText}%
                </div>
              </div>
            </div>
          </div>
          <SuccessAlert
            message={t("pronunciation.successMessage")}
            isVisible={showSuccess}
            onClose={() => setShowSuccess(false)}
          />
          <ErrorAlert
            message={error || t("pronunciation.error.uploadError")}
            isVisible={showError}
            onClose={() => setShowError(false)}
          />

          {uploadStatus === "failed" && (
            <p className={styles.errorMessage}>
              {t("pronunciation.error.uploadError")}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default PronunciationContainer;
