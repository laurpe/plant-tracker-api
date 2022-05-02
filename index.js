import express from "express";
import cors from "cors";
import Plant from "./models/plant.js";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import bodyParser from "body-parser";

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

app.get("/", function (req, res) {
    res.send("Hello World");
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

app.post("/api/plants", async (req, res) => {
    const plant = new Plant({
        name: faker.animal.insect(),
        soil: faker.animal.snake(),
        lastWatered: faker.date.recent(),
        wateringCycle: faker.random.number({ min: 1, max: 30 }),
    });

    const response = await plant.save();
    res.json(response);
});

app.delete("/api/plants/:id", async (req, res) => {
    const response = await Plant.deleteOne({ id: req.params.id });
    res.json(response);
});

app.listen(process.env.PORT);
