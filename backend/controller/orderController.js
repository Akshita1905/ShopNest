const Order = require("../model/Order.js");
const sendEmail = require("../utils/sendEmail.js");

const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, paymentId } = req.body;
        if (!items || items.length === 0 || !totalAmount || !address) {
            return res.status(400).json({ message: "Invalid order data" });
        }

        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            address,
            paymentId
        });

        await order.save();
        const message = `Dear ${req.user.name},\n\nYour order has been successfully placed. Here are the details:\n\nOrder ID: ${order._id}\nTotal Amount: ₹${totalAmount}\n\nThank you for shopping with us!\n\nBest regards,\nShopNest Team`;

        await sendEmail(req.user.email, "Order Confirmation", message);
        res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error });
    }
};

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.productId", "name price")
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching my orders", error });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching orders", error });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const allowedStatuses = ["pending", "shipped", "delivered"];
        const incomingStatus = String(req.body.status || "").toLowerCase();
        const status = allowedStatuses.includes(incomingStatus) ? incomingStatus : "pending";

        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            await order.save();
            return res.status(200).json({ message: "Order status updated successfully", order });
        }

        return res.status(404).json({ message: "Order not found" });
    } catch (error) {
        return res.status(500).json({ message: "Error updating order status", error });
    }
};

module.exports = { createOrder, myOrders, getOrders, updateOrderStatus };