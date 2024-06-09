import React, { useEffect, useState } from "react";
import Section from "./Section";
import infographicData from "../data/InfographicData";
import styles from "./css/Infographic.module.css";
import { useTranslation } from "react-i18next";

const InfographicRoadmap = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(null); // No article is active by default
  const totalArticles = infographicData.reduce(
    (acc, section) => acc + section.articles.length,
    0
  );

  const handleNextPrev = (step) => {
    // Toggle active state if the same step is clicked again
    if (step === activeStep) {
      setActiveStep(null); // Deactivate the article
    } else if (step >= 1 && step <= totalArticles) {
      setActiveStep(step); // Activate the clicked article
    } else {
      setActiveStep(null); // Deactivate article when out of bounds
    }
  };

  // Handle outside clicks to deactivate the active article
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the clicked element is not an article, deactivate the active article
      if (!event.target.closest(".article")) {
        setActiveStep(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>{t("infographic.title")}</h1>
      <div className={styles.infographicSection}>
        {infographicData.map((section, sectionIndex) => (
          <Section
            key={sectionIndex}
            {...section}
            isEvenSection={(sectionIndex + 1) % 2 === 0}
            sectionIndex={sectionIndex}
            activeStep={activeStep}
            handleNextPrev={handleNextPrev}
          />
        ))}
      </div>
    </div>
  );
};

export default InfographicRoadmap;
