const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
    serverSelectionTimeoutMS: 10000
});

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;