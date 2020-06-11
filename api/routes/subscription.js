const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { check, validationResult, body } = require("express-validator");

const User = require("../models/User");
const Subscription = require("../models/Subscriptions");

// * @route   POST api/subscription
// ? @desc    Post a new subscription to user's account
// ! @access  Private
router.post(
  "/",
  [
    auth,
    check("price")
      .notEmpty()
      .withMessage("cannot be empty")
      .isNumeric()
      .withMessage("must be a number")
      .toFloat()
      .customSanitizer(value => {
        return value.toFixed(2);
      }),
    check("name")
      .notEmpty()
      .withMessage("cannot be empty")
      .isString()
      .withMessage("must be a string")
      .isLength({ min: 1, max: 24 })
      .withMessage("must be less than 24 characters")
      .trim()
      .escape(),
    check("description")
      .optional()
      .isString()
      .withMessage("must be a string")
      .isLength({ max: 300 })
      .withMessage("must be less than 300 chars")
      .trim()
      .escape(),
    check("firstPaymentDate")
      .notEmpty()
      .withMessage("cannot be empty")
      .isISO8601()
      .withMessage("must be a date with formatting yyyy-mm-dd")
      .toDate(),
    check("interval", "Must be a number between 1 and 32")
      .notEmpty()
      .withMessage("cannot be empty")
      .isInt({
        min: 1,
        max: 32
      }),
    check("duration")
      .notEmpty()
      .withMessage("cannot be empty")
      .isString()
      .withMessage("must be a string")
      .trim()
      .isIn(["day", "week", "month", "year"])
      .withMessage("must be one of 'day', 'month', 'week', 'year'"),
    check("color", "Must be a hex color value")
      .optional()
      .isHexColor(),
    check("paymentMethod")
      .optional()
      .isString()
      .withMessage("must be a string")
      .isLength({ max: 24 })
      .withMessage("is too long"),
    check("note")
      .optional()
      .isString()
      .withMessage("must be a string")
      .isLength({ min: 1, max: 100 })
      .withMessage("must be less than 100 characters")
      .trim()
      .escape(),
    check("tags")
      .optional()
      .isArray()
      .withMessage("tags should be an array of strings")
      .custom(value => {
        let isValid = true;

        value.forEach(item => {
          if (typeof item !== "string") {
            isValid = false;
          }
        });

        return isValid;
      })
      .withMessage("items in tags should all be strings")
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const data = req.body;
      data.userId = req.userId;

      const subscription = await Subscription(data).save();

      res.json({ subscription });
    } catch (err) {
      console.log(err.errors);
      res.status(422).json({ errors: err.errors });
    }
  }
);

module.exports = router;
