import React from "react";
import styles from "./css/ProgressList.module.css";

const ProgressList = () => {
  const progressData = [
    { level: "Basic", current: 75, max: 100 },
    { level: "N5", current: 75, max: 100 },
    { level: "N4", current: 50, max: 100 },
    { level: "N3", current: 30, max: 100 },
    { level: "N2", current: 10, max: 100 },
    { level: "N1", current: 5, max: 100 },
  ];

  return (
    <div
      className={styles.progressSection}
      data-aos="fade-left"
      data-aos-once="true"
    >
      <div className={styles.title}>Japanese Study Current Progress 📚</div>
      {progressData.map((item, index) => (
        <div key={index} className={styles.taskProgress}>
          <p>
            {item.level}
            <span>{`${item.current}/${item.max}`}</span>
          </p>
          <progress
            className={`${styles.progress} ${styles[`progress${index + 1}`]}`} // Use template literals for dynamic class names
            max={item.max}
            value={item.current}
          ></progress>
        </div>
      ))}
    </div>
  );
};

export default ProgressList;
