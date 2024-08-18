import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./css/RegisterPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEnvelope,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useDispatch } from "react-redux";
import { register } from "../services/user/userSlice";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";

const RegisterPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    preferredLanguage: "english",
  });
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const validateForm = () => {
    let tempErrors = {};
    let formIsValid = true;

    // Username validation
    if (!formData.username.trim()) {
      formIsValid = false;
      tempErrors["username"] = t("RegisterPage.error.usernameRequired");
    } else if (!/^[a-z][a-z0-9]*$/.test(formData.username)) {
      formIsValid = false;
      tempErrors["username"] = t("RegisterPage.error.usernameInvalidFormat");
    } else if (formData.username.length < 8) {
      formIsValid = false;
      tempErrors["username"] = t("RegisterPage.error.usernameTooShort");
    } else if (formData.username.length > 32) {
      formIsValid = false;
      tempErrors["username"] = t("RegisterPage.error.usernameTooLong");
    }

    // Email validation
    if (!formData.email) {
      formIsValid = false;
      tempErrors["email"] = t("RegisterPage.error.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formIsValid = false;
      tempErrors["email"] = t("RegisterPage.error.emailInvalidFormat");
    } else if (formData.email !== formData.email.toLowerCase()) {
      formIsValid = false;
      tempErrors["email"] = t("RegisterPage.error.emailCaseInsensitive");
    }

    // Password validation
    if (!formData.password) {
      formIsValid = false;
      tempErrors["password"] = t("RegisterPage.error.passwordRequired");
    } else if (formData.password.length < 8) {
      formIsValid = false;
      tempErrors["password"] = t("RegisterPage.error.passwordTooShort");
    } else if (formData.password.length > 32) {
      formIsValid = false;
      tempErrors["password"] = t("RegisterPage.error.passwordTooLong");
    } else if (!/[A-Z]/.test(formData.password)) {
      formIsValid = false;
      tempErrors["password"] = t("RegisterPage.error.passwordNoUppercase");
    } else if (!/[a-z]/.test(formData.password)) {
      formIsValid = false;
      tempErrors["password"] = t("RegisterPage.error.passwordNoLowercase");
    } else if (!/[0-9]/.test(formData.password)) {
      formIsValid = false;
      tempErrors["password"] = t("RegisterPage.error.passwordNoNumber");
    } else if (!/[^\w\s]/.test(formData.password)) {
      formIsValid = false;
      tempErrors["password"] = t("RegisterPage.error.passwordNoSpecialChar");
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      formIsValid = false;
      tempErrors["confirmPassword"] = t("RegisterPage.error.passwordMismatch");
    }

    // Display name validation (optional)
    if (formData.displayName && typeof formData.displayName !== "string") {
      formIsValid = false;
      tempErrors["displayName"] = t("RegisterPage.error.displayNameInvalid");
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

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { confirmPassword, ...dataToSubmit } = formData;
    const dataWithRole = { ...dataToSubmit, roles: ["user"] };
    dispatch(register(dataWithRole))
      .unwrap()
      .then(() => {
        setAlert({
          show: true,
          message: t("RegisterPage.success.registrationComplete"),
          type: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        setAlert({
          show: true,
          message: error || t("RegisterPage.errorMessage.registrationFailed"),
          type: "error",
        });
      });
  };

  const closeAlert = () => {
    setAlert({ ...alert, show: false });
  };

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.formBox}>
          <div className={styles.headerForm}>
            <FontAwesomeIcon icon={faUser} size="9x" className={styles.icon} />
            <h2>{t("RegisterPage.header.register")}</h2>
          </div>
          <div className={styles.bodyForm}>
            <form onSubmit={handleRegister}>
              <div className={styles.inputGroup}>
                <FontAwesomeIcon icon={faUser} className={styles.icon} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={styles.formControl}
                  placeholder={t("RegisterPage.placeholder.username")}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.formControl}
                  placeholder={t("RegisterPage.placeholder.email")}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <FontAwesomeIcon icon={faLock} className={styles.icon} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.formControl}
                  placeholder={t("RegisterPage.placeholder.password")}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <FontAwesomeIcon icon={faLock} className={styles.icon} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={styles.formControl}
                  placeholder={t("RegisterPage.placeholder.confirmPassword")}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <FontAwesomeIcon icon={faUser} className={styles.icon} />
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className={styles.formControl}
                  placeholder={t("RegisterPage.placeholder.displayName")}
                />
              </div>
              <div className={styles.inputGroup}>
                <FontAwesomeIcon icon={faGlobe} className={styles.icon} />
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className={styles.formControl}
                >
                  <option value="english">
                    {t("RegisterPage.language.english")}
                  </option>
                  <option value="vietnamese">
                    {t("RegisterPage.language.vietnamese")}
                  </option>
                  <option value="japanese">
                    {t("RegisterPage.language.japanese")}
                  </option>
                </select>
              </div>
              <button type="submit" className={styles.button}>
                {t("RegisterPage.button.register")}
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
              <p>
                {t("RegisterPage.message.alreadyHaveAccount")}{" "}
                <Link to="/login">{t("RegisterPage.link.loginHere")}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegisterPage;
