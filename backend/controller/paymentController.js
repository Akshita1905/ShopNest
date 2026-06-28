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
            receipt: crypto.randomBytes(10).toString("hex"), // generate a random receipt id
        };
        const order = await instance.orders.create(options);
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: "Error creating order", error });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
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