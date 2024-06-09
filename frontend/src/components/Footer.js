import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./css/Footer.module.css";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <section className={styles.footerSection}>
          <h4 className={styles.footerHeading}>
            {t("footer.learningResources")}
          </h4>
          <ul className={styles.footerList}>
            <li>
              <Link to="/lessons">{t("footer.lessons")}</Link>
            </li>
            <li>
              <Link to="/study-tools">{t("footer.studyTools")}</Link>
            </li>
            <li>
              <Link to="/culture-notes">{t("footer.cultureNotes")}</Link>
            </li>
            <li>
              <Link to="/language-exchanges">
                {t("footer.languageExchanges")}
              </Link>
            </li>
          </ul>
        </section>

        <section className={styles.footerSection}>
          <h4 className={styles.footerHeading}>{t("footer.siteInfo")}</h4>
          <ul className={styles.footerList}>
            <li>
              <Link to="/about">{t("footer.aboutUs")}</Link>
            </li>
            <li>
              <Link to="/mission">{t("footer.ourMission")}</Link>
            </li>
            <li>
              <Link to="/testimonials">{t("footer.testimonials")}</Link>
            </li>
            <li>
              <Link to="/careers">{t("footer.careers")}</Link>
            </li>
          </ul>
        </section>

        <section className={styles.footerSection}>
          <h4 className={styles.footerHeading}>{t("footer.community")}</h4>
          <ul className={styles.footerList}>
            <li>
              <Link to="/forum">{t("footer.studentForum")}</Link>
            </li>
            <li>
              <Link to="/events">{t("footer.events")}</Link>
            </li>
            <li>
              <Link to="/news">{t("footer.news")}</Link>
            </li>
          </ul>
        </section>

        <section className={styles.footerSection}>
          <h4 className={styles.footerHeading}>{t("footer.support")}</h4>
          <ul className={styles.footerList}>
            <li>
              <Link to="/faqs">{t("footer.faqs")}</Link>
            </li>
            <li>
              <Link to="/contact">{t("footer.contactUs")}</Link>
            </li>
            <li>
              <Link to="/terms">{t("footer.termsOfService")}</Link>
            </li>
            <li>
              <Link to="/privacy">{t("footer.privacyPolicy")}</Link>
            </li>
          </ul>
        </section>

        <section className={styles.socialSection}>
          <h4 className={styles.footerHeading}>{t("footer.followUs")}</h4>
          <div className={styles.socialIcons}>
            <Link to="/facebook" className={styles.icon}>
              <FaFacebookF />
            </Link>
            <Link to="/instagram" className={styles.icon}>
              <FaInstagram />
            </Link>
            <Link to="/twitter" className={styles.icon}>
              <FaTwitter />
            </Link>
          </div>
        </section>
      </div>

      <div className={styles.footerBase}>
        <p className={styles.disclaimer}>{t("footer.disclaimer")}</p>
      </div>
    </footer>
  );
};

export default Footer;
