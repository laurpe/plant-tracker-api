import express from "express";
import cors from "cors";
import Plant from "./models/plant.js";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import { response } from "express";

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

app.get("/api/plants", async (req, res) => {
    const plants = await Plant.find({});
    res.json(plants);
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

app.listen(process.env.PORT);
