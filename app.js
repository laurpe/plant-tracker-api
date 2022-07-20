const express = require("express");
const cors = require("cors");
const Plant = require("./models/Plant.js");
const GrowingMedium = require("./models/GrowingMedium.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

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
    const plants = await Plant.find({});
    res.json(plants);
});

app.get("/api/plants/:id", async (req, res) => {
    const plant = await Plant.findById(req.params.id);
    res.json(plant);
});

app.put("/api/plants/:id", async (req, res) => {
    const body = req.body;

    const plant = await Plant.findByIdAndUpdate(
        req.params.id,
        {
            name: body.name,
            growingMedium: body.growingMedium,
            lastWatered: body.lastWatered,
            wateringCycle: body.wateringCycle,
            imageName: body.imageName,
        },
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
    const growingMediums = await GrowingMedium.find({});
    res.json(growingMediums);
});

app.get("/api/growing-mediums/:id", async (req, res) => {
    const growingMedium = await GrowingMedium.findById(req.params.id);
    res.json(growingMedium);
});

app.post("/api/growing-mediums", async (req, res) => {
    const mix = new GrowingMedium(req.body);

    const response = await mix.save();
    res.json(response);
});

// users

module.exports = app;
