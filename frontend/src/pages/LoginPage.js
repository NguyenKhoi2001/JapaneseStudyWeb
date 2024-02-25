import React, { useState } from "react";
import styles from "./css/LoginPage.module.css"; // Assuming the path is correct
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
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { apiUrl } from "../data/config";

import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    setError(""); // Reset error message

    try {
      const response = await fetch(apiUrl + "/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "An error occurred during login.");
      }

      console.log(data);
      localStorage.setItem("userToken", data.token);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <>
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
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <FontAwesomeIcon icon={faLock} className={styles.icon} />
                <input
                  type="password"
                  className={styles.formControl}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.button}>
                LOGIN
              </button>
            </form>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <div className={styles.message}>
              <div>
                <input type="checkbox" /> Remember ME
              </div>
              <div className={styles.redHover}>
                <Link to="#">Forgot your password</Link>
              </div>
            </div>
            <div className={styles.registerSection}>
              <p>
                Don't have an account? <Link to="/register">Register Here</Link>
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
