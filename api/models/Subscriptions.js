const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  payment: {
    paymentType: {
      type: String,
      enum: ["recurring", "one_time"],
      required: true
    },
    recurring: {
      firstPaymentDate: {
        type: Date,
        required: function() {
          return this.payment.paymentType === "recurring";
        }
      },
      interval: {
        type: Number,
        required: function() {
          return this.payment.paymentType === "recurring";
        }
      },
      duration: {
        type: String,
        required: function() {
          return this.payment.paymentType === "recurring";
        }
      }
    },
    one_time: {
      paymentDate: {
        type: Date,
        required: function() {
          return this.payment.paymentType === "one_time";
        }
      }
    }
  },
  color: String,
  paymentMethod: String,
  note: String,
  tags: [String]
});

module.exports = Subscription = mongoose.model(
  "subscription",
  SubscriptionSchema
);
