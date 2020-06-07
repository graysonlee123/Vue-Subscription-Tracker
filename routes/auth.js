const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

// * @route   GET api/auth
// ? @desc    Check a user's token
// ! @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    const token = req.headers['x-auth-token'];

    res.json({user, token});
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// * @route   POST api/auth/login
// ? @desc    Login a user
// ! @access  Public
router.post(
  "/login",
  [check("email").isEmail(), check("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) return res.status(404).send("No user found");

      let passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) return res.status(401).send({ token: null });

      let token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: 36000
      });

      res.status(200).send({ token, user });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
