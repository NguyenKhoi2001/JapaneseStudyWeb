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

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../services/user/userSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginStatus, loginError } = useSelector((state) => state.user);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ identifier: email, password })).then(({ type }) => {
      if (type.endsWith("fulfilled")) {
        navigate("/"); // Navigate to home on successful login
      }
    });
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
            {loginStatus === "failed" && (
              <p className={styles.errorMessage}>{loginError}</p>
            )}
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
