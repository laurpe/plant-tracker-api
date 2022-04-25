import mongoose from "mongoose";

const { Schema } = mongoose;

const plantSchema = new Schema({
    name: String,
    soil: String,
    lastWatered: Date,
    wateringCycle: Number,
});

export default mongoose.model("Plant", plantSchema);
