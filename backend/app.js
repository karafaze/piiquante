const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const sauceRoute = require("./routes/sauce");

require("dotenv").config();

mongoose
    .connect(
        `mongodb+srv://Fazli:${process.env.MONGO_PWD}@cluster0.jibmaps.mongodb.net/?retryWrites=true&w=majority`
    )
    .then(() => {
        console.log("Connected to MongoDB.");
    })
    .catch((err) => {
        console.log(`An error occured with MangoDB : ${err}.`);
    });

app.use(express.json());

app.use(express.static('./public'));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.use("/api/auth", userRoute);
app.use("/api/sauces", sauceRoute);

module.exports = app;