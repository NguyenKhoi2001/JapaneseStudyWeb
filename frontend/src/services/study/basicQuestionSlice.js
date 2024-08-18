// src/services/quiz/basicQuestionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Function to shuffle both questions and answers
function shuffleQuestionsAndAnswers(questions) {
  return questions
    .map((question) => {
      // Clone the question object to avoid mutation errors
      const clonedQuestion = { ...question };
      const answers = [...clonedQuestion.answers]; // Clone the answers array
      const correctAnswerValue = answers[clonedQuestion.correctAnswer];
      let currentIndex = answers.length,
        randomIndex;

      // Shuffle answers
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [answers[currentIndex], answers[randomIndex]] = [
          answers[randomIndex],
          answers[currentIndex],
        ];
      }

      // Update the correctAnswer index
      clonedQuestion.correctAnswer = answers.indexOf(correctAnswerValue);
      clonedQuestion.answers = answers; // Assign the shuffled answers back
      return clonedQuestion;
    })
    .sort(() => Math.random() - 0.5);
}

export const fetchRandomQuestions = createAsyncThunk(
  "basicQuestion/fetchRandomQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const dataModules = await Promise.all([
        import("../../features/learning/basic/data/HiraganaQuestionData"),
        import("../../features/learning/basic/data/KatakanaQuestionData"),
      ]);
      const allQuestions = [
        ...dataModules[0].questionsDataHiraganaToRomaji,
        ...dataModules[0].questionsDataHiraganaAudio,
        ...dataModules[1].questionsDataKatakanaToRomaji,
        ...dataModules[1].questionsDataKatakanaAudio,
      ];
      const shuffledQuestions = shuffleQuestionsAndAnswers(allQuestions);
      return shuffledQuestions.slice(0, 20);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      return rejectWithValue("Failed to fetch questions");
    }
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
