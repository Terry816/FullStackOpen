require("dotenv").config();

const connectToDatabase = require("./db");
const startServer = require("./server");

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4001;

const main = async () => {
  await connectToDatabase(MONGODB_URI);
  startServer(PORT);
};

main();
