const mongoose = require("mongoose");
const result = require("dotenv").config();

const connectDB = async () => {
  const dbstring =
    process.env.NODE_ENV === "production"
      ? process.env.PRODUCTION_DB
      : process.env.DEVELOPMENT_DB;

  try {
    await mongoose.connect(dbstring, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (err) {
    console.error("Database error:", err.message);
    process.exit();
  }
};

module.exports = connectDB;
