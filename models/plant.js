const mongoose = require("mongoose");
import GrowingMedium from "./GrowingMedium.js";

const { Schema } = mongoose;

const PlantSchema = new Schema({
    name: String,
    growingMedium: { type: Schema.Types.ObjectId, ref: GrowingMedium },
    soil: String,
    lastWatered: Date,
    wateringCycle: Number,
    imageName: String,
});

PlantSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Plant", plantSchema);
