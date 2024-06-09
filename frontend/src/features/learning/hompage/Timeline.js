import React from "react";
import styles from "./css/Timeline.module.css";
import { useTranslation } from "react-i18next";
import Course from "./Course";

const timelineStaticData = [
  {
    id: 1,
    color: "#e74c3c",
    route: "/basic",
  },
  {
    id: 2,
    color: "#2ecc71",
    route: "/n5",
  },
  {
    id: 3,
    color: "#e67e22",
    route: "/n4",
  },
  {
    id: 4,
    color: "#1abc9c",
    route: "/n3",
  },
  {
    id: 5,
    color: "#9b59b6",
    route: "/n2",
  },
  {
    id: 6,
    color: "#fff00f",
    route: "/n1",
  },
];

const Timeline = () => {
  const { t } = useTranslation();
  const timelineData = t("timelineData", { returnObjects: true });

  return (
    <section className={styles.sectionTimeline}>
      <div className={styles.container}>
        <ul className={styles.timeline}>
          {timelineData.map((item, index) => (
            <Course
              key={item.id}
              id={item.id}
              header={item.header}
              description={item.description}
              color={timelineStaticData[index].color}
              route={timelineStaticData[index].route}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Timeline;
