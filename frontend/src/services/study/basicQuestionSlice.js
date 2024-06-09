// src/services/quiz/basicQuestionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

export const fetchRandomQuestions = createAsyncThunk(
  "basicQuestion/fetchRandomQuestions",
  async () => {
    const { questionsDataHiraganaToRomaji, questionsDataHiraganaAudio } =
      await import("../../features/learning/basic/data/HiraganaQuestionData");
    const { questionsDataKatakanaToRomaji, questionsDataKatakanaAudio } =
      await import("../../features/learning/basic/data/KatakanaQuestionData");
    const allQuestions = [
      ...questionsDataHiraganaToRomaji,
      ...questionsDataHiraganaAudio,
      ...questionsDataKatakanaToRomaji,
      ...questionsDataKatakanaAudio,
    ];
    return shuffle(allQuestions).slice(0, 20); // Shuffle and pick 20 questions
  }
);

const initialState = {
  questions: [],
  activeQuestionIndex: 0,
  userAnswers: [],
  revealAnswers: false,
};

const basicQuestionSlice = createSlice({
  name: "basicQuestion",
  initialState,
  reducers: {
    resetQuiz(state) {
      state.questions = [];
      state.activeQuestionIndex = 0;
      state.userAnswers = [];
      state.revealAnswers = false;
    },
    answerQuestion(state, action) {
      const { questionIndex, answer } = action.payload;
      state.userAnswers[questionIndex] = answer;
    },
    setActiveQuestionIndex(state, action) {
      state.activeQuestionIndex = action.payload;
    },
    setRevealAnswers(state) {
      state.revealAnswers = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRandomQuestions.fulfilled, (state, action) => {
      state.questions = action.payload;
      state.userAnswers = Array(action.payload.length).fill(null);
    });
  },
});

export const {
  resetQuiz,
  answerQuestion,
  setActiveQuestionIndex,
  setRevealAnswers,
} = basicQuestionSlice.actions;
export default basicQuestionSlice.reducer;
