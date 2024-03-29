import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./css/NavBar.module.css";
import LanguageDropdown from "./LanguageDropDown";

function NavBar() {
  const [t, i18n] = useTranslation("translation");
  const [isNavVisible, setIsNavVisible] = useState(window.innerWidth > 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
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
  }, []); // Empty array ensures effect is only run on mount and unmount

  const handleChangeLanguages = (language) => {
    i18n.changeLanguage(language);
    console.log(language);
  };

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
  };

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
            <Link to="/introduction" className={styles.navItem}>
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
          <li className={styles.loginNavItem}>
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
            <LanguageDropdown handleChangeLanguages={handleChangeLanguages} />
          </li>
        </ul>
      )}
    </nav>
  );
}

export default NavBar;
