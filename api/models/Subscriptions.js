const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  price: Number,
  name: String,
  description: {
    type: String,
    default: null
  },
  firstPaymentDate: Date,
  interval: Number,
  duration: String,
  color: {
    type: String,
    default: "#ffffff"
  },
  paymentMethod: {
    type: String,
    default: null
  },
  note: {
    type: String,
    default: null
  },
  tags: {
    type: Array,
    default: []
  }
});

module.exports = Subscription = mongoose.model(
  "subscription",
  SubscriptionSchema
);
