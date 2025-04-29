const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },

    paymentID: {
      type: String,
    },
    orderID: {
      type: String,
      require: true,
    },
    currency: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    receipt: {
      type: String,
    },
    notes: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("paymentSchema", paymentSchema);
