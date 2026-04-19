const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

const path = require("path");
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);

// Health check
/* app.get('/', (req, res) => {
  res.json({ message: 'Task Management API is running!' });
}); */
// Serve React build
app.use(express.static(path.join(__dirname, "build")));

// Catch-all route (React routing)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
