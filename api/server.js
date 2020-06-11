const express = require("express");
const connectDB = require("./db");
const bodyParser = require("body-parser");

// Initialize Express
const app = express();
const router = express.Router();

// Connect to database
connectDB();

// Middleware
const allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(allowCrossDomain);

// Connect routes
app.use("/api/user", require("./routes/user"));
app.use("/api/subscription", require("./routes/subscription"));
app.use("/api/auth", require("./routes/auth"));

// Start server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, function() {
  console.log("Listening on port " + PORT);
});