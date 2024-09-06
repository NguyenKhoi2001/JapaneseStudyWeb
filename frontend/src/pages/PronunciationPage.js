import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadAudio,
  setAudioFile,
} from "../services/pronunciation/pronunciationSlice";
import styles from "./css/PronunciationPage.module.css";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const PronunciationPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
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

        // Log the audio Blob and its properties
        console.log("Audio Blob:", audioBlob);
        console.log("Blob type:", audioBlob.type);
        console.log("Blob size:", audioBlob.size);

        setAudioURL(audioUrl);
        await convertAudio(audioBlob);

        // Dispatch the action to store only the audio URL in Redux state
        dispatch(setAudioFile({ audioURL: audioUrl }));
      } else {
        console.error("No audio data available");
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

  const handleUploadClick = () => {
    const audioBlob = audioBlobRef.current;
    if (audioBlob) {
      // Dispatch the action to upload the converted Blob
      dispatch(uploadAudio(audioBlob)); // Now it's using the converted file
    } else {
      console.error("No audio file available for upload");
    }
  };

  const handleDownloadClick = () => {
    const audioBlob = audioBlobRef.current;
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = audioURL;
      a.download = "pronunciation_124kbps.mp3";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Japanese Pronunciation Practice</h1>

      <div className={styles.japaneseTextContainer}>
        <p className={styles.japaneseText}>こんにちは</p>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={`${styles.recordButton} ${
            isRecording ? styles.recording : ""
          }`}
          onClick={handleRecordButtonClick}
        >
          {isRecording ? "Stop Recording" : "Record"}
        </button>

        {audioURL && (
          <audio src={audioURL} controls className={styles.audioPlayer}></audio>
        )}

        {audioURL && (
          <button className={styles.uploadButton} onClick={handleUploadClick}>
            Upload and Transcribe
          </button>
        )}
        {audioURL && (
          <button
            className={styles.downloadButton}
            onClick={handleDownloadClick}
          >
            Download 124 kbps MP3
          </button>
        )}

        {uploadStatus === "loading" && <p>Uploading...</p>}
        {uploadStatus === "succeeded" && (
          <div>
            <p>Upload successful!</p>
            <p>Transcription: {transcript}</p>
          </div>
        )}
        {uploadStatus === "failed" && <p>Error: {error}</p>}
      </div>
    </div>
  );
};

export default PronunciationPage;
