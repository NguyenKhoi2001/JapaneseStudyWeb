import { useTranslation } from "react-i18next";
import styles from "./css/Article.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Article = ({
  headerText,
  bodyText,
  bgColorClass,
  bgBlurColorClass,
  isEvenSection,
  dataStep,
  stylingIndex,
  isActive,
  handleNextPrev,
  icon,
}) => {
  const { t } = useTranslation();
  // Since we're making buttons always visible, we use the same class for both
  const buttonClassNames = `${styles.btn} ${styles[bgColorClass] || ""}`;

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent click from reaching the document
    handleNextPrev(dataStep);
  };

  return (
    <article
      className={`${styles.article} ${isActive ? styles.active : ""} ${
        styles[`step${stylingIndex}`]
      }`}
      onClick={handleClick}
      data-step={dataStep}
    >
      <header
        className={`${styles.articleHeader} ${
          isEvenSection ? styles.evenArticleHeader : ""
        } ${styles[bgColorClass] || ""} ${styles[bgBlurColorClass] || ""}`}
      >
        <FontAwesomeIcon
          icon={icon}
          className={`${styles.icon} ${isEvenSection ? styles.evenIcon : ""} ${
            styles[bgColorClass] || ""
          }`}
        />
        <h6 className={styles.headerText}>{t(headerText)}</h6>
      </header>
      <div
        className={`${styles.body} ${isActive ? styles.bodyActive : ""} ${
          isEvenSection ? styles.evenBody : ""
        }`}
      >
        <p>{t(bodyText)}</p>
        <div className={styles.controls}>
          <button
            className={`${buttonClassNames} ${styles.prevBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              handleNextPrev(dataStep - 1);
            }}
          >
            Prev
          </button>
          <button
            className={`${buttonClassNames} ${styles.nextBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              handleNextPrev(dataStep + 1);
            }}
          >
            Next
          </button>
        </div>
      </div>
    </article>
  );
};

export default Article;
