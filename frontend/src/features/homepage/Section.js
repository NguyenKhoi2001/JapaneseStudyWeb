import React from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import Article from "./Article";
import styles from "./css/Section.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Section = ({
  title,
  textColorClass,
  bgColorClass,
  bgBlurColorClass,
  text,
  articles,
  isEvenSection,
  sectionIndex,
  activeStep,
  handleNextPrev,
  icon,
}) => {
  const { t } = useTranslation(); 
  const sectionClassNames = `${styles.section} ${styles[textColorClass] || ""}`;

  return (
    <section className={sectionClassNames}>
      <div className={styles.circle}>
        {icon && <FontAwesomeIcon icon={icon} className={styles.iconHeader} />}
        <h4>{t(title)}</h4>
        <p>{t(text)}</p>
      </div>
      {articles.map((article, index) => (
        <Article
          key={index}
          {...article}
          dataStep={sectionIndex * articles.length + index + 1}
          isActive={activeStep === sectionIndex * articles.length + index + 1}
          handleNextPrev={handleNextPrev}
          stylingIndex={((sectionIndex * articles.length + index) % 10) + 1}
          bgColorClass={bgColorClass}
          bgBlurColorClass={bgBlurColorClass}
          isEvenSection={isEvenSection}
          icon={icon}
        />
      ))}
    </section>
  );
};

export default Section;
