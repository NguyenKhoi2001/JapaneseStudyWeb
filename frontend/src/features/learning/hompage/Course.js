import React from "react";
import { Link } from "react-router-dom";
import styles from "./css/Course.module.css";

const Course = ({ id, header, description, color, route }) => {
  return (
    <li className={styles.course}>
      <Link to={route} style={{ textDecoration: "none" }}>
        <div className={styles.content} style={{ borderColor: color }}>
          <h3 style={{ backgroundColor: color, color: "white" }}>{header}</h3>
          <ul>
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </Link>
    </li>
  );
};

export default Course;
