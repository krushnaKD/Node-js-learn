const Razorpay = require('razorpay');

var instance = new Razorpay({
    key_id: process.env.Razorpay_id,
    key_secret: process.env.Razorpay_Key,
  });

  module.exports = instance;

  //# CLIENT_URL=http://localhost:5173/