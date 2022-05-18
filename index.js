import express from "express";
import cors from "cors";
import Plant from "./models/plant.js";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4());
    },
});

const upload = multer({ storage: storage }).single("file");

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

app.delete("/api/plants/:id", async (req, res) => {
    const response = await Plant.findByIdAndRemove(req.params.id);
    res.json(response);
});

app.post("/api/plants", async (req, res) => {
    const plant = new Plant(req.body);

    const response = await plant.save();
    res.json(response);
});

app.post("/api/upload", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.sendStatus(500);
        }
        res.send(req.file);
    });
});

app.use(express.static("images"));

app.listen(process.env.PORT);
