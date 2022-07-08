const mongoose = require("mongoose");

const { Schema } = mongoose;

const CompositionSchema = new Schema(
    {
        component: String,
        percentage: Number,
    },
    { _id: false }
);

const GrowingMediumSchema = new Schema({
    name: String,
    composition: [CompositionSchema],
});

GrowingMediumSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("GrowingMedium", GrowingMediumSchema);
