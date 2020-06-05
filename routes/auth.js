const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

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

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).send("No user found");

    let passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) return res.status(401).send({ token: null });

    let token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: 36000
    });
    res.status(200).send({ token, user });
  }
);

module.exports = router;
