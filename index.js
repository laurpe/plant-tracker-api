import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import Plant from "./models/Plant.js";
import GrowingMedium from "./models/GrowingMedium.js";

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

// plant data

app.get("/api/plants", async (req, res) => {
    const plants = await Plant.find({}).populate({ path: "growingMedium" });
    res.json(plants);
});

app.get("/api/plants/:id", async (req, res) => {
    const plant = await Plant.findById(req.params.id).populate({
        path: "growingMedium",
    });
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

// growth medium data

app.get("/api/growing-mediums", async (req, res) => {
    const mixes = await GrowingMedium.find({});
    res.json(mixes);
});

app.post("/api/growing-mediums", async (req, res) => {
    const mix = new GrowingMedium(req.body);

    const response = await mix.save();
    res.json(response);
});

app.listen(process.env.PORT);
