const Razorpay = require("razorpay");
const crypto = require("crypto");
dotenv = require("dotenv").config();

const createdOrder = async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const options = {
            amount: req.body.amount * 100, // amount in the smallest currency unit
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        if (!order) return res.status(500).json({ message: "Some error occurred while creating Razorpay order" });
        return res.status(200).json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID,
            receipt: order.receipt,
            notes: order.notes
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return res.status(500).json({ message: "Error creating order", error: error.message || error });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id
        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");
            if (generated_signature === razorpay_signature) {
                return res.status(200).json({ message: "Payment verified successfully" });
            } else {
                return res.status(400).json({ message: "Invalid signature" });
            }
    } catch (error) {
        return res.status(500).json({ message: "Error verifying payment", error });
    }
};

module.exports = { createdOrder, verifyPayment };