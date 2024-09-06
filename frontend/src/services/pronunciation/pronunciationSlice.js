import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchWrapper from "../fetchWrapper";

// AssemblyAI API configuration
const API_KEY = "1eede8749d6b4a8e94af2b9f16a2e5ef";
const uploadEndpoint = "https://api.assemblyai.com/v2/upload";

const transcriptEndpoint = "https://api.assemblyai.com/v2/transcript";

export const uploadAudio = createAsyncThunk(
  "pronunciation/uploadAudio",
  async (audioFile, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("file", audioFile, "recording.mp3"); // Changed to .mp3

    try {
      // Step 1: Upload audio file to AssemblyAI
      console.log("Uploading file to AssemblyAI...");
      const uploadResponse = await fetchWrapper(uploadEndpoint, {
        method: "POST",
        headers: {
          authorization: API_KEY,
        },
        body: formData,
      });

      const uploadResult = await uploadResponse.json();
      console.log("Upload result:", uploadResult);

      if (!uploadResult.upload_url) {
        throw new Error("Failed to upload the audio file");
      }

      const audioUrl = uploadResult.upload_url;

      // Step 2: Request transcription
      console.log("Requesting transcription from AssemblyAI...");
      const transcriptResponse = await fetchWrapper(transcriptEndpoint, {
        method: "POST",
        headers: {
          authorization: API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio_url: audioUrl,
          language_code: "ja", // Japanese language code
        }),
      });

      const transcriptResult = await transcriptResponse.json();
      console.log("Transcript result:", transcriptResult);

      if (!transcriptResult.id) {
        throw new Error("Failed to get transcript ID");
      }

      const transcriptId = transcriptResult.id;

      // Step 3: Poll for transcription result
      let transcription = "";
      const timeout = Date.now() + 60000; // Set a 1-minute timeout
      while (Date.now() < timeout) {
        console.log("Polling transcription status...");
        const statusResponse = await fetchWrapper(
          `${transcriptEndpoint}/${transcriptId}`,
          {
            method: "GET",
            headers: {
              authorization: API_KEY,
            },
          }
        );

        const statusResult = await statusResponse.json();
        console.log("Transcription status response:", statusResult);

        if (statusResult.status === "completed") {
          transcription = statusResult.text;
          break;
        } else if (statusResult.status === "failed") {
          return rejectWithValue("Transcription failed");
        }

        await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5 seconds
      }

      if (!transcription) {
        throw new Error("Transcription timed out");
      }

      return transcription;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.message || "Failed to upload and transcribe audio"
      );
    }
  }
);

// Slice definition
const pronunciationSlice = createSlice({
  name: "pronunciation",
  initialState: {
    isRecording: false,
    audioFile: null,
    audioURL: null,
    uploadStatus: "idle",
    transcript: null,
    error: null,
  },
  reducers: {
    startRecording: (state) => {
      state.isRecording = true;
      state.audioFile = null;
      state.audioURL = null;
      state.transcript = null; // Clear previous transcript
    },
    stopRecording: (state) => {
      state.isRecording = false;
    },
    setAudioFile: (state, action) => {
      state.audioFile = action.payload.audioFile;
      state.audioURL = action.payload.audioURL;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadAudio.pending, (state) => {
        state.uploadStatus = "loading";
      })
      .addCase(uploadAudio.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        state.transcript = action.payload; // Store the transcript in the state
      })
      .addCase(uploadAudio.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { startRecording, stopRecording, setAudioFile } =
  pronunciationSlice.actions;

export default pronunciationSlice.reducer;
