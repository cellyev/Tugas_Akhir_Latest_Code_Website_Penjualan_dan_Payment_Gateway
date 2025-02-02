const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const CORS = require("cors");
const { connectToDB } = require("./db/connectToDB");
const productRoute = require("./routes/productRoute");
const transactionRoute = require("./routes/transactionRoute");
const path = require("path");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(CORS({ origin: `${process.env.CLIENT_URL}`, credentials: true }));

app.use("/api/product", productRoute);
app.use("/api/transaction", transactionRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(process.env.PORT, () => {
  connectToDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
