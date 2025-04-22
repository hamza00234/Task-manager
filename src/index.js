const express = require("express");
const mongoose = require("./db/mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const userRouter = require("./routers/user");


require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use("/api/v1", userRouter);


const PORT = process.env.PORT||3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
