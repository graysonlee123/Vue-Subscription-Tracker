const express = require("express");
const connectDB = require("./utils/db");
const bodyParser = require("body-parser");
const path = require("path");
const history = require("connect-history-api-fallback");

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
app.use(history());

// Connect Routes
app.use("/api/user", require("./routes/user"));
app.use("/api/subscription", require("./routes/subscription"));
app.use("/api/auth", require("./routes/auth"));

// Serve static files
app.use(express.static(path.join(__dirname, "public/")));
app.use(express.static(path.join(__dirname, "../dist/")));

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, function() {
  console.log("Server listening on port " + PORT);
});
