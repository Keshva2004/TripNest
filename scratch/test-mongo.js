const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const dburl = process.env.ATLASDB_URL;
const localDbUrl = "mongodb://127.0.0.1:27017/wanderlust";

async function test() {
  console.log("Testing Atlas DB connection...");
  try {
    await mongoose.connect(dburl);
    console.log("Connected to Atlas DB successfully!");
  } catch (err) {
    console.error("Atlas DB connection failed, falling back to local DB...", err.message);
    try {
      await mongoose.connect(localDbUrl);
      console.log("Connected to local DB successfully!");
    } catch (localErr) {
      console.error("Local DB connection also failed!", localErr);
      process.exit(1);
    }
  }

  try {
    const store = MongoStore.create({
      client: mongoose.connection.getClient(),
      crypto: {
        secret: process.env.SECRET || "default_secret",
      },
      touchAfter: 24 * 3600
    });
    console.log("MongoStore created successfully!");
    process.exit(0);
  } catch (storeErr) {
    console.error("Error creating MongoStore:", storeErr);
    process.exit(1);
  }
}

test();
