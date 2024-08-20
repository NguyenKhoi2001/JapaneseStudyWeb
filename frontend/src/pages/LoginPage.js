import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./css/LoginPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faUser,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTwitterSquare,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";
import { useDispatch } from "react-redux";
import { login } from "../services/user/userSlice";
import LoadingPage from "./LoadingPage";

const LoginPage = () => {
  const { t } = useTranslation();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  const validatePassword = (password) => {
    return password.length >= 8 && password.length <= 32;
  };
  const validateForm = () => {
    let formIsValid = true;
    let tempErrors = {};

    // Validate email or username
    if (!emailOrUsername.trim()) {
      formIsValid = false;
      tempErrors["emailOrUsername"] = t(
        "LoginPage.errorMessage.emptyEmailUsername"
      );
    }

    // Validate password
    if (!validatePassword(password)) {
      formIsValid = false;
      tempErrors["password"] = t("LoginPage.errorMessage.passwordLength");
    }

    // Display error messages if any
    if (Object.keys(tempErrors).length > 0) {
      setAlert({
        show: true,
        message: Object.values(tempErrors).join(" "),
        type: "error",
      });
    }

    return formIsValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await dispatch(login({ identifier: emailOrUsername, password })).unwrap();
      setAlert({
        show: true,
        message: t("LoginPage.successMessage.loginSuccess"),
        type: "success",
      });
      setTimeout(() => {
        setAlert({ ...alert, show: false });
        navigate("/");
      }, 2000);
    } catch (error) {
      setAlert({
        show: true,
        message: error || t("LoginPage.errorMessage.loginError"),
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeAlert = () => {
    setAlert({ ...alert, show: false });
  };

  return (
    <>
      {isLoading && <LoadingPage opacity={0.7} />}
      <NavBar />
      <div className={styles.container}>
        <div className={styles.formBox}>
          <div className={styles.headerForm}>
            <FontAwesomeIcon
              icon={faUserCircle}
              size="9x"
              className={styles.icon}
            />
          </div>
          <div className={styles.bodyForm}>
            <form onSubmit={handleLogin}>
              <div className={styles.inputGroup}>
                <FontAwesomeIcon icon={faUser} className={styles.icon} />
                <input
                  type="text"
                  className={styles.formControl}
                  placeholder={t("LoginPage.emailPlaceholder")}
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <FontAwesomeIcon icon={faLock} className={styles.icon} />
                <input
                  type="password"
                  className={styles.formControl}
                  placeholder={t("LoginPage.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.button}>
                {t("LoginPage.loginButton")}
              </button>
            </form>
            {alert.show &&
              (alert.type === "success" ? (
                <SuccessAlert
                  message={alert.message}
                  isVisible={alert.show}
                  onClose={closeAlert}
                />
              ) : (
                <ErrorAlert
                  message={alert.message}
                  isVisible={alert.show}
                  onClose={closeAlert}
                />
              ))}
            <div className={styles.message}>
              <div>
                <input type="checkbox" /> {t("LoginPage.rememberMe")}
              </div>
              <div className={styles.redHover}>
                <Link to="#">{t("LoginPage.forgotPassword")}</Link>
              </div>
            </div>
            <div className={styles.registerSection}>
              <p>
                {t("LoginPage.noAccount")}{" "}
                <Link to="/register">{t("LoginPage.registerHere")}</Link>
              </p>
            </div>
            <div className={styles.socialIconsContainer}>
              <Link to="#">
                <FontAwesomeIcon
                  icon={faFacebookF}
                  className={styles.socialIcon}
                />
              </Link>
              <Link to="#">
                <FontAwesomeIcon
                  icon={faTwitterSquare}
                  className={styles.socialIcon}
                />
              </Link>
              <Link to="#">
                <FontAwesomeIcon
                  icon={faGoogle}
                  className={styles.socialIcon}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
