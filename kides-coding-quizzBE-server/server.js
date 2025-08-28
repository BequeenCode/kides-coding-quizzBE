const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your React dev server
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/quiz", require("./routes/quiz")); 

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running correctly!" });
});

// MongoDB Atlas connection
const MONGODB_URI = "mongodb+srv://girumbeimnet74:enuti12345@cluster0.svbjron.mongodb.net/kidsquiz?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err.message);
  
  // Provide specific error messages
  if (err.name === 'MongoNetworkError') {
    console.error("Network error. Check your internet connection and MongoDB Atlas IP whitelist.");
  } else if (err.name === 'MongoServerError') {
    if (err.code === 8000) {
      console.error("Authentication failed. Check your MongoDB Atlas username and password.");
    } else if (err.message.includes("different case")) {
      console.error("Database name case conflict. Try using 'kidsQuiz' instead of 'kidsquiz' in your connection string.");
    }
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});