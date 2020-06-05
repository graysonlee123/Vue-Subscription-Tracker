const express = require("express");
const connectDB = require("./db");
const bodyParser = require("body-parser");

// Initialize Express
const app = express();
const router = express.Router();

// Connect to database
connectDB();

// Middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
}

app.use(allowCrossDomain);

// Define routes
router.post('/register', function(res, res) {
  // TODO: Write logic
});

router.post('/login', (req, res) => {
  // TODO: Write logic
});

// Start server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, function() {
  console.log('Listening on port ' + PORT);
})