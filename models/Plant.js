const mongoose = require("mongoose");
const GrowingMedium = require("./GrowingMedium.js");
const User = require("./User.js");

const { Schema } = mongoose;

const PlantSchema = new Schema({
    name: String,
    growingMedium: { type: Schema.Types.ObjectId, ref: GrowingMedium },
    lastWatered: Date,
    wateringCycle: Number,
    imageName: String,
    userId: { type: Schema.Types.ObjectId, ref: User },
});

PlantSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Plant", PlantSchema);
