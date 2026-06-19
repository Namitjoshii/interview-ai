require("dotenv").config();

const { MongoClient } = require("mongodb");

async function run() {
  try {
    console.log("Connecting...");

    const client = new MongoClient(process.env.MONGO_URI);

    await client.connect();

    console.log("✅ CONNECTED");

    await client.close();
  } catch (err) {
    console.error("❌ ERROR");
    console.error(err);
  }
}

run();