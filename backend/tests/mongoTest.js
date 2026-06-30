const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://akshita:akshita1905@cluster0.fcmr0v3.mongodb.net/shopnest?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    console.log("✅ MongoDB Connected Successfully!");

    await client.close();
  } catch (err) {
    console.log("❌ Connection Error:");
    console.log(err);
  }
}

run();