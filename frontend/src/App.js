// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./i18n";
import HomePage from "./pages/HomePage";
import "./components/css/global.css";

function App() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
