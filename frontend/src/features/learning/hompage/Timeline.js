import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllLevels } from "../../../services/level/levelSlice"; // Adjust the import path as needed
import styles from "./css/Timeline.module.css";
import { useTranslation } from "react-i18next";
import Course from "./Course";
import ErrorAlert from "../../../components/ErrorAlert";

const timelineStaticData = [
  {
    id: 1,
    color: "#e74c3c",
    route: "/basic",
  },
  {
    id: 2,
    color: "#2ecc71",
    route: "/level",
  },
  {
    id: 3,
    color: "#e67e22",
    route: "/level",
  },
  {
    id: 4,
    color: "#1abc9c",
    route: "/level",
  },
  {
    id: 5,
    color: "#9b59b6",
    route: "/level",
  },
  {
    id: 6,
    color: "#fff00f",
    route: "/level",
  },
];

const Timeline = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const levels = useSelector((state) => state.level.items || []);

  useEffect(() => {
    dispatch(fetchAllLevels());
  }, [dispatch]);

  // Fetching translated data for timeline
  const timelineData = t("timelineData", { returnObjects: true });
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleError = (message) => {
    setErrorMessage(message);
    setErrorVisible(true);
  };
  // Skipping the first timeline entry (Basic) and mapping levels starting from N5
  const combinedData = timelineData.slice(1).map((item, index) => {
    const level = levels[index];
    // Ensure description is an array
    const description = Array.isArray(item.description)
      ? item.description
      : [item.description];
    return {
      ...item,
      color: timelineStaticData[index + 1].color,
      route: timelineStaticData[index + 1].route,
      description: description,
      levelId: level ? level._id : null,
    };
  });

  // Add the Basic level without backend data
  combinedData.unshift({
    ...timelineData[0],
    color: timelineStaticData[0].color,
    route: timelineStaticData[0].route,
    description: Array.isArray(timelineData[0].description)
      ? timelineData[0].description
      : [timelineData[0].description],
    levelId: 1,
  });

  return (
    <section className={styles.sectionTimeline}>
      <ErrorAlert
        message={errorMessage}
        isVisible={errorVisible}
        onClose={() => setErrorVisible(false)}
      />
      <div className={styles.container}>
        <ul className={styles.timeline}>
          {combinedData.map((item) => (
            <Course
              key={item.id}
              id={item.levelId}
              header={item.header}
              description={item.description} // Ensured to be an array
              color={item.color}
              route={item.route}
              onError={handleError}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Timeline;
