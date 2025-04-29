const express = require("express");
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const paymentSchema = require("../models/payments");
const { membershipAmount } = require("../utils/constants");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { MembershipType } = req.body;

    const { firstName, lastName, emailID } = req.user;
    const order = await razorpayInstance.orders.create({
      amount:membershipAmount[MembershipType] * 100,
      currency: "INR",
      receipt: "receipt_1",
      notes: {
        firstName,
        lastName,
        emailID,
        MembershipType: MembershipType,
      },
    });

    const payment = new paymentSchema({
      userId: req.user._id,
      currency: order.currency,
      orderId: order.id,
      status: order.status,
      receipt: order.receipt,
      notes: order.notes,
      amount: order.amount,
    });

    const savedpayments = await payment.save();

    res.json({ ...savedpayments.toJSON() });
  } catch (error) {
    return res.status(500).json({ msg: error.massage });
  }
});

module.exports = paymentRouter;
