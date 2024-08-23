import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "../services/user/preferencesSlice";
import styles from "./css/NavBar.module.css";
import LanguageDropdown from "./LanguageDropDown";
import defaultUserIcon from "../assets/images/userIcon.png";

function NavBar() {
  const [t, i18n] = useTranslation("translation");
  const [isNavVisible, setIsNavVisible] = useState(window.innerWidth > 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const language = useSelector((state) => state.preferences.language);
  const currentUserData = useSelector((state) => state.user.currentUserData); // Get current user data from Redux

  useEffect(() => {
    i18n.changeLanguage(language);
    const handleResize = () => {
      setIsNavVisible(window.innerWidth > 768);
    };
    const checkLoginStatus = () => {
      const token = localStorage.getItem("userToken");
      setIsLoggedIn(!!token);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);
    checkLoginStatus();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [language, i18n]); // Empty array ensures effect is only run on mount and unmount

  const handleChangeLanguages = (language) => {
    dispatch(setLanguage(language));
  };

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    window.location.href = "/";
  };
  const userIcon = currentUserData.profilePicture || defaultUserIcon;
  return (
    <nav className={styles.navBar}>
      <div className={styles.logoContainer}>
        <Link to="/" className={styles.logo}>
          KK
        </Link>
        <div className={styles.logoSubText}>
          <p>TDT</p>
          <p>University</p>
        </div>
      </div>
      <div className={styles.tempDiv}></div>
      <button className={styles.hamburger} onClick={toggleNav}>
        ☰
      </button>
      {isNavVisible && (
        <ul className={styles.navList}>
          <li>
            <Link to="/" className={styles.navItem}>
              {t("navbar.intro")}
            </Link>
          </li>
          <li>
            <Link to="/blog" className={styles.navItem}>
              {t("navbar.blog")}
            </Link>
          </li>
          <li>
            <Link to="/learning" className={styles.navItem}>
              {t("navbar.courses")}
            </Link>
          </li>
          {isLoggedIn && (
            <li className={styles.userIconContainer}>
              <Link to="/user" className={styles.navItem}>
                <img src={userIcon} alt="User" className={styles.userIcon} />
              </Link>
            </li>
          )}
          <li className={isLoggedIn ? styles.loginActive : styles.loginNavItem}>
            {isLoggedIn ? (
              <button onClick={handleLogout} className={styles.navItem}>
                {t("navbar.logout")}
              </button>
            ) : (
              <Link to="/login" className={styles.navItem}>
                {t("navbar.login")}
              </Link>
            )}
          </li>
          <li className={styles.languageChange}>
            <LanguageDropdown
              handleChangeLanguages={handleChangeLanguages}
              currentLanguage={i18n.language}
            />
          </li>
        </ul>
      )}
    </nav>
  );
}

export default NavBar;
