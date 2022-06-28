const mongoose = require("mongoose");

const { Schema } = mongoose;

const plantSchema = new Schema({
    name: String,
    soil: String,
    lastWatered: Date,
    wateringCycle: Number,
    imageName: String,
});

plantSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

export default mongoose.model("Plant", plantSchema);
