import React, { useState } from "react";
import styles from "./css/RegisterPage.module.css"; // Reusing the CSS from LoginPage for consistency
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
import { useDispatch, useSelector } from "react-redux";
import { register } from "../services/user/userSlice";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";

const RegisterPage = () => {
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

    if (!formData.username.trim()) {
      formIsValid = false;
      tempErrors["username"] = "Username cannot be empty.";
    }

    if (!formData.email) {
      formIsValid = false;
      tempErrors["email"] = "Email cannot be empty.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formIsValid = false;
      tempErrors["email"] = "Email format is invalid.";
    }

    if (!formData.password) {
      formIsValid = false;
      tempErrors["password"] = "Password cannot be empty.";
    } else if (formData.password.length < 8) {
      formIsValid = false;
      tempErrors["password"] = "Password must be at least 8 characters long.";
    }

    if (formData.password !== formData.confirmPassword) {
      formIsValid = false;
      tempErrors["confirmPassword"] = "Passwords do not match.";
    }

    if (Object.keys(tempErrors).length > 0) {
      setAlert({
        show: true,
        message: Object.values(tempErrors).join(" "),
        type: "error",
      });
      return false;
    }
    return formIsValid;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { confirmPassword, ...userData } = formData;
    dispatch(register(userData))
      .unwrap()
      .then(() => {
        setAlert({
          show: true,
          message: "Registration successful!",
          type: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        setAlert({
          show: true,
          message: error.message || "Registration failed!",
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
            <h2>Register</h2>
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
                  placeholder="Username"
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
                  placeholder="Email"
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
                  placeholder="Password"
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
                  placeholder="Confirm Password"
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
                  placeholder="Display Name (Optional)"
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
                  <option value="english">English</option>
                  <option value="vietnamese">Vietnamese</option>
                  <option value="japanese">Japanese</option>
                </select>
              </div>
              <button type="submit" className={styles.button}>
                Register
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
                Already have an account? <Link to="/login">Login Here</Link>
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
