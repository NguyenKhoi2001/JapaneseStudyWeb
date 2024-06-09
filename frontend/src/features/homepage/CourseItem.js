import React from "react";
import styles from "./css/CourseItem.module.css"; // Adjust the import path as necessary
import { useTranslation } from "react-i18next";

const CourseItem = ({ levelKey }) => {
  const { t } = useTranslation();
  const title = t(`${levelKey}.title`);
  let points = t(`${levelKey}.points`, { returnObjects: true });

  // Ensure points is an array
  if (!Array.isArray(points)) {
    points = [];
  }

  return (
    <div className={styles.courseItem}>
      <h2>{title}</h2>
      <ul>
        {points.map((point, index) => (
          <li key={index}>{point}</li> // Render each bullet point as a list item
        ))}
      </ul>
    </div>
  );
};

export default CourseItem;
