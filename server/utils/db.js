const mongoose = require("mongoose");
const result = require("dotenv").config();

if (result.error) {
  throw result.error;
  process.exit();
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DEVELOPMENT_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (err) {
    console.error("Database error:", err.message);
    process.exit();
  }
};

module.exports = connectDB;
