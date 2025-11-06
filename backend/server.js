const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ProjectModel = require("./events.models");

const app = express();

// Simple structured logger
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

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/algobyteDB")
  .then(() => logger.info("MongoDB connected successfully"))
  .catch((err) => logger.error("MongoDB connection error:", err.message));

// GET route for /work endpoint
app.get("/work", async (req, res) => {
  try {
    const projects = await ProjectModel.find();
    logger.info("Fetched work projects:", projects.length);
    res.json(projects);
  } catch (err) {
    logger.error("Error fetching work projects:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET route for /timeline endpoint
app.get("/timeline", async (req, res) => {
  try {
    const events = await ProjectModel.find();
    logger.info("Fetched timeline events:", events.length);
    res.json(events);
  } catch (err) {
    logger.error("Error fetching timeline events:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get only upcoming events
app.get('/work/upcoming', async (req, res) => {
  try {
    const projects = await ProjectModel.find({ category: 'upcoming' })
      .sort({ date: 1 })
      .lean();
    
    logger.info(`Fetched ${projects.length} upcoming events`);
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    logger.error('Error fetching upcoming events:', err.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch upcoming events',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get only past events
app.get('/work/past', async (req, res) => {
  try {
    const projects = await ProjectModel.find({ category: 'past' })
      .sort({ date: -1 })
      .lean();
    
    logger.info(`Fetched ${projects.length} past events`);
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    logger.error('Error fetching past events:', err.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch past events',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Start server
app.listen(3001, () => {
  logger.info("Server running on http://localhost:3001");
});
