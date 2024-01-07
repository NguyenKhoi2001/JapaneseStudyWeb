import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./css/FeatureIntro.module.css";
import BlogIcon from "../../assets/images/FeatureIntroIcon1.png";
import LearnIcon from "../../assets/images/FeatureIntroIcon2.png";
import ChatIcon from "../../assets/images/FeatureIntroIcon3.png";
import PronunciationIcon from "../../assets/images/FeatureIntroIcon4.png";

const FeatureIntro = () => {
  const { t } = useTranslation();

  const features = [
    {
      title: t("features.communityInsights.title"),
      text: t("features.communityInsights.text"),
      img: BlogIcon,
    },
    {
      title: t("features.comprehensiveLearning.title"),
      text: t("features.comprehensiveLearning.text"),
      img: LearnIcon,
    },
    {
      title: t("features.senseiConnect.title"),
      text: t("features.senseiConnect.text"),
      img: ChatIcon,
    },
    {
      title: t("features.pronunciationPractice.title"),
      text: t("features.pronunciationPractice.text"),
      img: PronunciationIcon,
    },
  ];

  return (
    <div>
      <h1 className={styles.mainTitle}>{t("features.mainTitle")}</h1>
      <div className={styles.container}>
        {features.map((feature, index) => (
          <div key={index} className={styles.column}>
            <img
              src={feature.img}
              alt={feature.title}
              className={styles.image}
            />
            <h2 className={styles.title}>{feature.title}</h2>
            <p className={styles.text}>{feature.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureIntro;
