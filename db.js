const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  } catch (err) {
    console.error('Database error:', err.message);
  }
}

module.exports = connectDB;