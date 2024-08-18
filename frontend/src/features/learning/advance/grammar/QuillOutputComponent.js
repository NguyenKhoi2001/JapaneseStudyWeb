// QuillOutputComponent.js
import React from "react";
import styles from "./css/QuillOutputComponent.module.css"; // Ensure this path is correct

const QuillOutputComponent = ({ editorHtml, title = "Grammar Lesson" }) => {
  return (
    <div className={styles.rawHtmlDisplay}>
      <h2 className={styles.centerText}>{title}</h2>
      <div
        style={{
          width: "100%",
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "200px",
          marginTop: "20px",
        }}
        dangerouslySetInnerHTML={{ __html: editorHtml }}
      ></div>
    </div>
  );
};

export default QuillOutputComponent;
