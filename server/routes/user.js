const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const User = require("../models/User");
const Subscriptions = require("../models/Subscriptions");

// User.find({}).then(data => {
//   console.log(data);

//   data.forEach(function(x) {
//     x.update({
//       $set: {
//         avatarUrl: `https://via.placeholder.com/200/8369fe/eeebff?text=${x.first_name[0].toUpperCase()}${x.last_name[0].toUpperCase()}`
//       }
//     }).then((data, err) => {
//       console.log({ data, err });
//     });
//   });
// });

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return callback(err);

      callback(
        null,
        `${raw.toString("hex")}${path.extname(file.originalname)}`
      );
    });
  },
  destination: path.join(__dirname, "../public/avatars")
});

// Save the new configured middleware
const upload = multer({ storage });

// * @route   POST api/user
// ? @desc    Register user
// ! @access  Public
router.post(
  "/",
  [
    check("email")
      .notEmpty()
      .withMessage("cannot be empty")
      .bail()
      .normalizeEmail()
      .isEmail()
      .withMessage("must be an email")
      .bail()
      .custom(value => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject("is already in use");
          }
        });
      }),
    check("first_name")
      .notEmpty()
      .withMessage("cannot be empty")
      .bail()
      .isString()
      .isAlpha()
      .withMessage("can only contain letters")
      .trim(),
    check("last_name")
      .notEmpty()
      .withMessage("cannot be empty")
      .bail()
      .isString()
      .isAlpha()
      .withMessage("can only contain letters")
      .trim(),
    check("password")
      .isLength({ min: 6, max: 32 })
      .withMessage("must be between 6 and 32 characters")
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
        id: user.id
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

// * @route   POST api/user/password
// ? @desc    Update your password
// ! @access  Private
router.post(
  "/password",
  [
    auth,
    check("currentPassword").notEmpty().withMessage("cannot be empty"),
    check("newPassword")
      .isLength({ min: 6, max: 32 })
      .withMessage("Must be between 6 and 32 characters")
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      let user = await (
        await User.findById(req.userId, "password")
      ).execPopulate();

      const comparison = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      // If the comparison fails...
      if (comparison !== true) {
        console.log(comparison);
        return res.status(402).json({
          errors: [{ param: "currentPassword", msg: "incorrect password" }]
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.newPassword, salt);

      // Otherwise, set the new password
      await User.findByIdAndUpdate(req.userId, {
        password: hash
      });

      res.status(200).end();
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// * @route   PATCH api/user/
// ? @desc    Update a user
// ! @access  Private
router.patch(
  "/",
  [
    auth,
    check("first_name")
      .optional()
      .isAlpha()
      .withMessage("should only by alphabetic")
      .bail()
      .trim(),
    check("last_name")
      .optional()
      .isAlpha()
      .withMessage("should only by alphabetic")
      .bail()
      .trim(),
    check("email")
      .optional()
      .normalizeEmail()
      .isEmail()
      .withMessage("must be a valid email format")
      .bail()
      .custom(value => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject("is already in use");
          }
        });
      })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      let data = {};

      if (req.body.first_name) {
        data.first_name = req.body.first_name;
      }

      if (req.body.last_name) {
        data.last_name = req.body.last_name;
      }

      if (req.body.email) {
        data.email = req.body.email;
      }

      const dbUser = await User.findByIdAndUpdate(req.userId, data, {
        new: true
      });

      res.json(dbUser);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// * @route   DELETE api/user
// ? @desc    Delete logged in user
// ! @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    const subscriptions = await Subscriptions.deleteMany({
      userId: req.userId
    });

    res.json({ user, subscriptions });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// * @route   GET api/user
// ? @desc    Get user
// ! @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(402);
    }

    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// * @route   POST api/user/avatar
// ? @desc    Post an avatar
// ! @access  Private
router.post("/avatar", [auth, upload.single("avatar")], async (req, res) => {
  if (!req.file) {
    return res.send({
      success: false
    });
  } else {
    const filename = req.file.filename;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        avatarFileName: filename
      },
      { new: true }
    );

    const host = req.hostname;
    const filePath = `${req.protocol}://${host}/${req.file.path}`

    return res.send({
      success: true,
      filename: req.file.filename,
      user
    });
  }
});

module.exports = router;
