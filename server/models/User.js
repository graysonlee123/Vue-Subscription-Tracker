const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  avatarFileName: {
    type: String,
    default: function () {
      return `https://via.placeholder.com/200/8369fe/eeebff?text=${this.first_name[0]}${this.last_name[0]}`;
    },
    required: true
  }
});

module.exports = User = mongoose.model("user", UserSchema);
