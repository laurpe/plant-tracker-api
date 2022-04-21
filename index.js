const express = require("express");
const cors = require("cors");
const app = express();
const createPlants = require("./helperFunctions");

app.use(cors());

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.get("/api/plants", function (req, res) {
    res.send(createPlants(10));
});

app.listen(3001);
