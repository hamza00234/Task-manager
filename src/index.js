const express = require("express");
const mongoose = require("./db/mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
//const dotenv = require("dotenv");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");


require("dotenv").config();




app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],

  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", userRouter);
app.use("/api/v1",taskRouter);



const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
