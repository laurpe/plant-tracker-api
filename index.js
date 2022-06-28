import express from "express";
import cors from "cors";
import Plant from "./models/plant.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";

const serverless = require("serverless-http");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const url = process.env.MONGODB_URI;

mongoose
    .connect(url)
    .then((result) => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.message);
    });

app.get("/api/plants", async (req, res) => {
    const plants = await Plant.find({});
    res.json(plants);
});

app.get("/api/plants/:id", async (req, res) => {
    const plant = await Plant.findById(req.params.id);
    res.json(plant);
});

app.put("/api/plants/:id", async (req, res) => {
    const { lastWatered } = req.body;
    const plant = await Plant.findByIdAndUpdate(
        req.params.id,
        { lastWatered: lastWatered },
        {
            new: true,
        }
    );
    res.json(plant);
});

app.delete("/api/plants/:id", async (req, res) => {
    const response = await Plant.findByIdAndRemove(req.params.id);
    res.json(response);
});

app.post("/api/plants", async (req, res) => {
    const plant = new Plant(req.body);

    const response = await plant.save();
    res.json(response);
});

module.exports.handler = serverless(app);
