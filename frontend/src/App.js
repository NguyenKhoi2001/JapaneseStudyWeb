import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";
// import LearningPage from "./pages/LearningPage";

import AuthRoute from "./AuthRoute";

import "./i18n";
import "./components/css/global.css";

import TextInputAndSpeaker from "./features/test/TextInput";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute>
                <RegisterPage />
              </AuthRoute>
            }
          />
          {/* <Route path="/learning" element={<LearningPage />} /> */}
          <Route path="/test" element={<TextInputAndSpeaker />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
