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
import { apiUrl } from "../data/config";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    preferredLanguage: "english",
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState();
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

    setErrors(tempErrors);
    return formIsValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("Validation failed.");
      return;
    }

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      displayName: formData.displayName,
      preferredLanguage: formData.preferredLanguage,
      roles: ["user"],
    };
    console.log("Form data submitted:", userData);
    try {
      const response = await fetch(`${apiUrl}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "An error occurred during registration."
        );
      }

      console.log("Registration successful:", data);
      localStorage.setItem("userToken", data.token);
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      setGlobalError(error.message);
    }
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
            {Object.keys(errors).map((errorKey) => (
              <p key={errorKey} className={styles.errorMessage}>
                {errors[errorKey]}
              </p>
            ))}
            {globalError && (
              <p className={styles.errorMessage}>{globalError}</p>
            )}
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
