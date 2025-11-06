import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";


const logger = {
  info: (...args) => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[INFO]:", ...args);
    }
  },
  warn: (...args) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[WARN]:", ...args);
    }
  },
  error: (...args) => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ERROR]:", ...args);
    }
  },
};

const Timeline = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/timeline")
      .then((response) => {
        logger.info("Timeline data received:", response.data);
        setProjects(response.data);
      })
      .catch((err) => {
        logger.error("Error fetching timeline:", err.message);
      });
  }, []);

  return (
    <div id="timeline">
      <div className="timelineBox">
        {projects.map((item, index) => (
          <TimelineItem
            heading={item.title}
            text={item.date}
            index={index}
            key={item.title}
          />
        ))}
      </div>
    </div>
  );
};

const TimelineItem = ({ heading, text, index }) => (
  <div
    className={`timelineItem ${
      index % 2 === 0 ? "leftTimeline" : "rightTimeline"
    }`}
  >
    <div>
      <h2>{heading}</h2>
      <p>{text}</p>
    </div>
  </div>
);

export default Timeline;
