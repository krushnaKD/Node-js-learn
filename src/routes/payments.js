const express = require("express");
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const paymentSchema = require("../models/payments");
const User = require("../models/user");
const { membershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershiType } = req.body;

    const { firstName, lastName, emailID } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershiType] * 100,
      currency: "INR",
      receipt: "receipt_1",
      notes: {
        firstName,
        lastName,
        emailID,
        MembershipType: membershiType,
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

    console.log(savedpayments);

    res.json({ ...savedpayments.toJSON(), keyId: process.env.Razorpay_id });
  } catch (error) {
    return res.status(500).json({ msg: error.massage });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.headers("X-Razorpay-Signature");
    const iswebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.Razorpay_webhook
    );

    if (!iswebhookValid) {
      res.status(500).json({ msg: "Webhook Signature is not Valid" });
    }

    const paymentDetails = req.body.payload.payment.entity;

    const payment = await paymentSchema.findOne({
      orderId: paymentDetails._id,
    });
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershiptype = payment.notes.membershiType;

    await User.save();


    // if (req.body.event === "payment.captured") {
    // }
    // if (req.body.event === "payment.failed") {
    // }

    return res.status(500).json({ msg: "webhook validate" });
  } catch (error) {
    res.status(500).json({ msg: error.massage });
  }
});

module.exports = paymentRouter;
