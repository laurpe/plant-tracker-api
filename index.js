const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.get("/api/plants", function (req, res) {
    res.send({ id: "1245" });
});

app.listen(3001);
