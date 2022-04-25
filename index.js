import express from "express";
import cors from "cors";
import Plant from "./models/plant.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());

const url = process.env.MONGODB_URI;

mongoose
    .connect(url)
    .then((result) => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.message);
    });

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.get("/api/plants", function (req, res) {
    res.send("hello from plants");
});

app.listen(process.env.PORT);
