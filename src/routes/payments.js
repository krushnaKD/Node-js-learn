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
    const webhookSignature = req.get('X-Razorpay-Signature');
    console.log("webhooksignature ", webhookSignature);
    
    const iswebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.Razorpay_webhook
    );

    if (!iswebhookValid) {
      return res.status(400).json({ msg: "Webhook Signature is not Valid" });
    }

    const paymentDetails = req.body.payload.payment.entity;
  
    console.log( "paymentDetails",paymentDetails);
    

    const payment = await paymentSchema.findOne({
      orderId: paymentDetails.order_id, 
    });

    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }
    console.log("payment", payment);
    

    payment.status = paymentDetails.status;
    await payment.save();
    console.log("✅ Payment saved:", payment);

    const user = await User.findById(payment.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.isPremium = true;
    user.membershiptype = payment.notes.membershipType; 
    await user.save();
    console.log("✅ User updated:", user);

    res.status(200).json({ msg: "Webhook processed successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.massage });
  }
});

module.exports = paymentRouter;
