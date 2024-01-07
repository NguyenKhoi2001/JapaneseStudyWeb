// NavBar.js
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./css/NavBar.module.css";
import LanguageDropdown from "./LanguageDropDown";

function NavBar() {
  const [t, i18n] = useTranslation("translation");

  const handleChangeLanguages = (language) => {
    i18n.changeLanguage(language);
    console.log(language);
  };

  return (
    <nav className={styles.navBar}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>KK</div>
        <div className={styles.logoSubText}>
          <p>TDT</p>
          <p>University</p>
        </div>
      </div>
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
          <Link to="/courses" className={styles.navItem}>
            {t("navbar.courses")}
          </Link>
        </li>
        <li>
          <Link to="/pronunciation" className={styles.navItem}>
            {t("navbar.pronunciation")}
          </Link>
        </li>
        <li className={styles.loginNavItem}>
          <Link to="/login" className={styles.navItem}>
            {t("navbar.login")}
          </Link>
        </li>
        <li>
          <LanguageDropdown handleChangeLanguages={handleChangeLanguages} />
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
