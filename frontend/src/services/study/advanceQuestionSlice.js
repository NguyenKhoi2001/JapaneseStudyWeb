// src/services/quiz/advanceQuestionSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeQuestionIndex: 0,
  userAnswers: [],
  revealAnswers: false,
};

const advanceQuestionSlice = createSlice({
  name: "quizSlider",
  initialState,
  reducers: {
    setActiveQuestionIndex(state, action) {
      state.activeQuestionIndex = action.payload;
    },
    answerQuestion(state, action) {
      const { questionIndex, answer } = action.payload;
      state.userAnswers[questionIndex] = answer;
    },
    setRevealAnswers(state, action) {
      state.revealAnswers = action.payload;
    },
    resetQuiz(state) {
      state.activeQuestionIndex = 0;
      state.userAnswers = [];
      state.revealAnswers = false;
    },
  },
});

export const {
  setActiveQuestionIndex,
  answerQuestion,
  setRevealAnswers,
  resetQuiz,
} = advanceQuestionSlice.actions;

export default advanceQuestionSlice.reducer;
