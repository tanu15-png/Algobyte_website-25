import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
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


const Work = () => {
  const [projects, setProjects] = useState([]);


  useEffect(() => {
    axios
      .get("http://localhost:3001/work")
      .then((response) => {
        logger.info("Work data received:", response.data);
        setProjects(response.data);
      })
      .catch((err) => {
        logger.error("Error fetching work:", err.message);
      });
  }, []);

  return (
    <div id="work">
      <h2>Events</h2>
      <section>
        <article>
          {projects.length === 0 ? (
            <p>Loading projects...</p>
          ) : (
            <Carousel
              showArrows
              showIndicators
              showStatus={false}
              showThumbs={false}
              interval={3000}
              infiniteLoop
              autoPlay
              stopOnHover
            >
              {projects.map((project) => (
                <div key={project._id || project.title} className="workItem">
                  <img
                    src={project.imgSrc || project.image}
                    alt={project.title}
                    onError={(e) => {
                      logger.error("Image failed to load:", project.imgSrc);
                      e.target.src =
                        "https://via.placeholder.com/600x400?text=" +
                        encodeURIComponent(project.title);
                    }}
                  />
                  <aside>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <a
                      target="_blank"
                      href={project.url || project.link}
                      rel="noreferrer"
                    >
                      View
                    </a>
                  </aside>
                </div>
              ))}
            </Carousel>
          )}
        </article>
      </section>
    </div>
  );
};

export default Work;
