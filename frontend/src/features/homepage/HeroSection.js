// HeroSection.js
import React from "react";
import styles from "./css/HeroSection.module.css";
import HeroImage from "../../assets/images/HeroImage2.png";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.heroSection}>
      <div className={styles.heroText}>
        <h1>{t("heroSection.welcome")}</h1>
        <ul className={styles.heroHighlights}>
          <li>{t("heroSection.point1")}</li>
          <li>{t("heroSection.point2")}</li>
          <li>{t("heroSection.point3")}</li>
          <li>{t("heroSection.point4")}</li>
          <li>{t("heroSection.point5")}</li>
        </ul>
        <p>{t("heroSection.conclusion")}</p>
      </div>

      <div className={styles.heroImageContainer}>
        <img src={HeroImage} alt="Hero" className={styles.heroImage} />
      </div>
    </div>
  );
};

export default HeroSection;
