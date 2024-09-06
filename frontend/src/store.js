// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./services/user/userSlice";
import basicQuestionReducer from "./services/study/basicQuestionSlice";
import advanceQuestionReducer from "./services/study/advanceQuestionSlice";
import preferencesReducer from "./services/user/preferencesSlice";
import vocabularyReducer from "./services/vocabulary/vocabularySlice";
import kanjiReducer from "./services/kanji/kanjiSlice";
import grammarReducer from "./services/grammar/grammarSlice";
import lessonReducer from "./services/lesson/lessonSlice";
import levelReducer from "./services/level/levelSlice";
import userProgressReducer from "./services/userProgress/userProgressSlice";
import questionReducer from "./services/question/questionSlice";
import pronunciationReducer from "./services/pronunciation/pronunciationSlice"; // <-- Import the pronunciation slice

export const store = configureStore({
  reducer: {
    user: userReducer,
    basicQuestion: basicQuestionReducer,
    advanceQuestion: advanceQuestionReducer,
    preferences: preferencesReducer,
    vocabularies: vocabularyReducer,
    kanji: kanjiReducer,
    grammar: grammarReducer,
    lesson: lessonReducer,
    level: levelReducer,
    userProgress: userProgressReducer,
    question: questionReducer,
    pronunciation: pronunciationReducer,
  },
});
