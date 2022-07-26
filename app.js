const express = require("express");
const cors = require("cors");
const Plant = require("./models/Plant.js");
const GrowingMedium = require("./models/GrowingMedium.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const User = require("./models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

app.post("/api/users", async (req, res) => {
    const { email, password } = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        email,
        password: passwordHash,
    });

    const response = await user.save();
    res.json(response);
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        res.json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET
    );

    res.json({ token, email: user.email });
});

app.use((req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).json({ error: "token missing or invalid" });
    }

    const token = req.headers.authorization.substring(7);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    res.locals.userId = decodedToken.id;

    next();
});

// plant data

app.get("/api/plants", async (req, res) => {
    const plants = await Plant.find({ userId: res.locals.userId });
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
    const plant = new Plant({ ...req.body, userId: res.locals.userId });

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

// app.get("/api/users", async (req, res) => {
//     const users = await User.find({});

//     res.json(users);
// });

module.exports = app;
