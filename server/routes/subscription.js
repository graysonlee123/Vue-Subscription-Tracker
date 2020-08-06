const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { check, validationResult, body } = require("express-validator");
const he = require('he');

const User = require("../models/User");
const Subscription = require("../models/Subscriptions");

// * @route   GET api/subscription
// ? @desc    Get user's subscriptions
// ! @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.userId });

    if (!subscriptions) {
      return res.status(404).json({ msg: "Subscriptions not found" });
    }

    subscriptions.forEach((sub, index) => {
      // Decode anything that was escaped in the sanitizer
      subscriptions[index].name = he.decode(subscriptions[index].name);
      subscriptions[index].description = he.decode(subscriptions[index].description);
      subscriptions[index].paymentMethod = he.decode(subscriptions[index].paymentMethod);
      subscriptions[index].note = he.decode(subscriptions[index].note);
    });

    res.json({ subscriptions });
  } catch (err) {
    console.log(err);
    res.status(422).send("Server error");
  }
});

// * @route   GET api/subscription/:id
// ? @desc    Get user's subscription by id
// ! @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ msg: "Subscription not found" });
    }

    // Decode anything that was escaped in the sanitizer
    subscription.name = he.decode(subscription.name);
    subscription.description = he.decode(subscription.description);
    subscription.paymentMethod = he.decode(subscription.paymentMethod);
    subscription.note = he.decode(subscription.note);

    res.json({ subscription });
  } catch (err) {
    console.log(err);
    res.status(422).send("Server error");
  }
});

// * @route   POST api/subscription
// ? @desc    Add subscription to user's account
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
      .customSanitizer(value => {
        return parseFloat(value).toFixed(2);
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
      .withMessage("is too long")
      .escape(),
    check("note")
      .optional()
      .isString()
      .withMessage("must be a string")
      .isLength({ min: 0, max: 100 })
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

      res.json({ subscription: await Subscription(data).save() });
    } catch (err) {
      console.log(err.errors);
      res.status(422).send("Server error");
    }
  }
);

// * @route   POST api/subscription/:id
// ? @desc    Update a subscription
// ! @access  Private
router.post(
  "/:id",
  [
    auth,
    check("price")
      .notEmpty()
      .withMessage("cannot be empty")
      .isNumeric()
      .withMessage("must be a number")
      .customSanitizer(value => {
        return parseFloat(value).toFixed(2);
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
      .withMessage("is too long")
      .escape(),
    check("note")
      .optional()
      .isString()
      .withMessage("must be a string")
      .isLength({ min: 0, max: 100 })
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
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const subscriptionVerification = await Subscription.findById(
        req.params.id
      );

      if (!subscriptionVerification) {
        return res.status(404).json({ msg: "Subscription not found" });
      } else if (subscriptionVerification.userId != req.userId) {
        return res.status(400).json({
          msg: "Not authenticated to update this post"
        });
      }

      const subscriptionUpdate = await Subscription.findOneAndUpdate(
        { _id: req.params.id },
        { ...req.body },
        { new: true }
      );

      res.json({ subscription: subscriptionUpdate });
    } catch (err) {
      console.log(err.errors);
      res.status(422).send("Server error");
    }
  }
);

// * @route   DELETE api/subscription/:id
// ? @desc    Remove a subscription
// ! @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ msg: "Subscription not found" });
    }

    if (subscription.userId != req.userId) {
      return res.status(400).json({
        msg: "Not authenticated to update this post"
      });
    }

    subscription.delete();

    res.status(200).json({ deleted: subscription });
  } catch (err) {
    console.log(err.errors);
    res.status(422).send("Server error");
  }
});

module.exports = router;
