import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import AuthRoute from "./AuthRoute";

import "./i18n";
import "./components/css/global.css";
import { useDispatch } from "react-redux";
import { initializeUser, logout } from "./services/user/userSlice";
import LoadingPage from "./pages/LoadingPage";
import UserProfilePage from "./pages/UserProfilePage";
import AdvanceLearningPage from "./pages/AdvanceLearningPage";
import LessonDisplayPage from "./pages/LessonDisplayPage";

const HomePage = lazy(() => import("./pages/HomePage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const LearningPage = lazy(() => import("./pages/LearningPage"));
const UserDashboardPage = lazy(() => import("./pages/UserDashboardPage"));
const BasicLearningPage = lazy(() => import("./pages/BasicLearningPage"));

const useScript = (url, attributes = {}) => {
  useEffect(() => {
    // Create script element
    const script = document.createElement("script");
    script.src = url;
    script.async = true;

    // Apply any passed attributes to the script element
    Object.keys(attributes).forEach((key) => {
      script.setAttribute(key, attributes[key]);
    });

    // Append the script to the body
    document.body.appendChild(script);

    // Remove the script from the body when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, [url, attributes]); // Re-run effect if url or attributes change
};

// Component to handle global logout
function LogoutListener() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleTokenExpired = () => {
      dispatch(logout());
      navigate("/login");
    };

    window.addEventListener("token-expired", handleTokenExpired);

    return () => {
      window.removeEventListener("token-expired", handleTokenExpired);
    };
  }, [navigate, dispatch]);

  return null;
}
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  // Correctly call useScript here at the top level of the component
  useScript("https://kamimind.ai/kami-chat-widget.js", {
    id: "kami-chat-widget",
    token: "CVFdthl1N0qz3SPnErrOJtHiFRk9NTzS",
    charset: "utf-8",
    botToken: "5fba8bce-df9c-4edb-bcd7-1f8e7d0ebe24",
    defer: "true", // Corrected the defer attribute to be a valid string
  });

  return (
    <Router>
      <LogoutListener />
      <div className="App">
        <Suspense fallback={<LoadingPage />}>
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
            <Route path="/user/:userId" element={<UserProfilePage />} />
            <Route path="/user/" element={<UserProfilePage />} />
            <Route path="/basic" element={<BasicLearningPage />} />
            <Route path="/advance-learning" element={<AdvanceLearningPage />} />
            <Route path="/level/:levelId" element={<LessonDisplayPage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/userDashboard" element={<UserDashboardPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
