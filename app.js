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
    .then(() => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.message);
    });

app.post("/api/users", async (req, res) => {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });

    if (foundUser) {
        return res.status(400).json({
            error: "Email already associated with an account",
        });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        email,
        password: passwordHash,
    });

    await user.save();

    res.sendStatus(201);
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        res.status(400).json({ error: "Invalid email or password" });
        return;
    }

    const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: 5 }
    );

    const refreshToken = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: 10 }
    );

    res.json({ token, refreshToken, email: user.email });
});

app.post("/api/refresh", async (req, res) => {
    const body = req.body;
    const refreshToken = body.refreshToken;

    jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
        (error, decodedToken) => {
            if (error) {
                res.status(400).json({ error: "Invalid refresh token" });
                return;
            }
            const token = jwt.sign(
                { email: decodedToken.email, id: decodedToken.id },
                process.env.JWT_SECRET,
                { expiresIn: 5 }
            );

            res.json({ token });
        }
    );
});

app.use((req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "Token missing or invalid" });
    }

    const token = req.headers.authorization.substring(7);

    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
        if (error) {
            return res.status(401).json({ error: "Token missing or invalid" });
        }

        res.locals.userId = decodedToken.id;

        next();
    });
});

app.delete("/api/users", async (req, res) => {
    const response = await User.findByIdAndRemove(res.locals.userId);

    if (!response) {
        return res.status(401).json({ error: "Not authorized" });
    }

    await Plant.deleteMany({ userId: res.locals.userId });
    await GrowingMedium.deleteMany({ userId: res.locals.userId });

    res.sendStatus(200);
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
    const growingMediums = await GrowingMedium.find({
        userId: [res.locals.userId, null],
    });
    res.json(growingMediums);
});

app.get("/api/growing-mediums/:id", async (req, res) => {
    const growingMedium = await GrowingMedium.findById(req.params.id);
    res.json(growingMedium);
});

app.post("/api/growing-mediums", async (req, res) => {
    const mix = new GrowingMedium({ ...req.body, userId: res.locals.userId });

    const response = await mix.save();
    res.json(response);
});

module.exports = app;
