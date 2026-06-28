const Order = require("../model/Order.js");
const User = require("../model/User.js");
const Product = require("../model/Product.js");

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({role: "user"});
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});

        const orders = await Order.find({});

        const totalRevenueData = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        
        return res.status(200).json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue: totalRevenueData
        });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching admin stats" });
    }
};

module.exports = { getAdminStats };