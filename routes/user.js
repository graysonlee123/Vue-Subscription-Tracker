const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

// * @route   POST api/user
// ? @desc    Register user
// ! @access  Public
router.post(
  "/",
  [
    check("email")
      .notEmpty()
      .withMessage("Must provide an email")
      .bail()
      .normalizeEmail()
      .isEmail()
      .withMessage("Must be a valid email format")
      .bail()
      .custom(value => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject("Email is already in use");
          }
        });
      }),
    check("first_name")
      .notEmpty()
      .withMessage("Must provide a first name")
      .bail()
      .isString()
      .isAlpha()
      .withMessage("Must be letters only")
      .trim(),
    check("last_name")
      .notEmpty()
      .withMessage("Must provide a last name")
      .bail()
      .isString()
      .isAlpha()
      .withMessage("Must be letters only")
      .trim(),
    check("password")
      .isLength({ min: 6, max: 32 })
      .withMessage("Must be between 6 and 32 characters")
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, first_name, last_name, password } = req.body;

    try {
      let user = new User({
        email,
        first_name,
        last_name,
        password
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
