import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as questionAPI from "./question.api";

// Fetch all questions
export const fetchAllQuestions = createAsyncThunk(
  "questions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await questionAPI.fetchQuestions();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch question by ID
export const getQuestion = createAsyncThunk(
  "questions/getById",
  async (id, { rejectWithValue }) => {
    try {
      return await questionAPI.fetchQuestionById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new question
export const createQuestion = createAsyncThunk(
  "questions/create",
  async (questionData, { rejectWithValue }) => {
    try {
      return await questionAPI.addQuestion(questionData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update an existing question
export const updateQuestion = createAsyncThunk(
  "questions/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const result = await questionAPI.updateQuestion(id, updates);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a question
export const removeQuestion = createAsyncThunk(
  "questions/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await questionAPI.deleteQuestion(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Shuffle the questions and their answers
function shuffleQuestionsAndAnswers(questions) {
  return questions
    .map((question) => {
      const clonedQuestion = { ...question };
      const answers = [...clonedQuestion.answers];
      const correctAnswerValue = answers[clonedQuestion.correctAnswer];
      let currentIndex = answers.length,
        randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [answers[currentIndex], answers[randomIndex]] = [
          answers[randomIndex],
          answers[currentIndex],
        ];
      }

      clonedQuestion.correctAnswer = answers.indexOf(correctAnswerValue);
      clonedQuestion.answers = answers;
      return clonedQuestion;
    })
    .sort(() => Math.random() - 0.5);
}

// Fetch questions by lesson ID and shuffle them
export const fetchQuestionsByLessonThunk = createAsyncThunk(
  "questions/fetchByLesson",
  async (lessonId, { rejectWithValue }) => {
    try {
      const questions = await questionAPI.fetchQuestionsByLesson(lessonId);
      return shuffleQuestionsAndAnswers(questions);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch questions by level ID
export const fetchQuestionsByLevelThunk = createAsyncThunk(
  "questions/fetchByLevel",
  async (levelId, { rejectWithValue }) => {
    try {
      return await questionAPI.fetchQuestionsByLevel(levelId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch custom questions by lesson ID with query parameters
export const fetchCustomQuestionsFromLessonThunk = createAsyncThunk(
  "questions/fetchCustomFromLesson",
  async ({ lessonId, params }, { rejectWithValue }) => {
    try {
      return await questionAPI.fetchCustomQuestionsFromLesson(lessonId, params);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch custom questions by level ID with query parameters
export const fetchCustomQuestionsFromLevelThunk = createAsyncThunk(
  "questions/fetchCustomFromLevel",
  async ({ levelId, params }, { rejectWithValue }) => {
    try {
      return await questionAPI.fetchCustomQuestionsFromLevel(levelId, params);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  status: "idle",
  error: null,
};

// Slice for handling question-related state and actions
const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setActiveQuestionIndex(state, action) {
      state.activeQuestionIndex = action.payload;
    },
    answerQuestion(state, action) {
      const { index, answer } = action.payload;
      state.userAnswers[index] = answer;
    },
    setRevealAnswers(state, action) {
      state.revealAnswers = action.payload;
    },
    resetQuiz(state) {
      state.activeQuestionIndex = 0;
      state.userAnswers = Array(state.items.length).fill(null);
      state.revealAnswers = false;
      if (state.items.length > 0) {
        state.items = shuffleQuestionsAndAnswers(state.items);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllQuestions.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.status = "succeeded";
      })
      .addCase(fetchQuestionsByLessonThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.userAnswers = new Array(action.payload.length).fill(null);
        state.activeQuestionIndex = 0;
        state.revealAnswers = false;
        state.status = "succeeded";
      })
      .addCase(fetchQuestionsByLevelThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(
        fetchCustomQuestionsFromLessonThunk.fulfilled,
        (state, action) => {
          state.items = action.payload;
          state.status = "succeeded";
        }
      )
      .addCase(
        fetchCustomQuestionsFromLevelThunk.fulfilled,
        (state, action) => {
          state.items = action.payload;
          state.status = "succeeded";
        }
      )
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const index = state.items.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.status = "succeeded";
      })
      .addCase(removeQuestion.fulfilled, (state, action) => {
        state.items = state.items.filter((v) => v.id !== action.payload);
        state.status = "succeeded";
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

export const {
  setActiveQuestionIndex,
  answerQuestion,
  setRevealAnswers,
  resetQuiz,
} = questionSlice.actions;

export default questionSlice.reducer;
