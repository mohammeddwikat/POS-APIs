import express from "express";
import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/task", { useNewUrlParser: true });
const dataBase = mongoose.connection;
dataBase.once("error", (error) => console.error(error));
dataBase.once("open", () => console.log("Connected to database Successfully"));

const app = express();
const port = 3100;
const router = require("../router");

app.use("/task/category", router.categoryRouter);
app.use("/task/product", router.productRouter);
app.use("/task/checkout", router.checkoutRouter);
app.use("/task/user", router.userRouter);

app.listen(port, () => {
  console.log("Application Running on port :" + port);
});

//npm run dev
//go to c:\
// ./ngrok authtoken 1pn4CoKWCggSIfLyvHDuxN4D3mm_eUf7RhW4joQce2fqMPAv
// ./ngrok http 3100
//http://<generated ID>.ngrok.io/