// Course.js
import React from "react";
import styles from "./css/Course.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectLevel } from "../../../services/level/levelSlice";

const Course = ({ id, header, description, color, route, onError }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSelectCourse = () => {
    if (route.includes("basic")) {
      navigate(route);
    } else if (!id) {
      onError("No valid ID for the course. Cannot navigate.");
    } else {
      dispatch(selectLevel(id));
      navigate(`${route}/${id}`);
    }
  };

  return (
    <li className={styles.course} onClick={handleSelectCourse}>
      <div className={styles.content} style={{ borderColor: color }}>
        <h3 style={{ backgroundColor: color, color: "white" }}>{header}</h3>
        <ul>
          {description.map((desc, index) => (
            <li key={index}>{desc}</li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default Course;
