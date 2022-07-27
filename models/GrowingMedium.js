const mongoose = require("mongoose");
const User = require("./User.js");

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
    userId: { type: Schema.Types.ObjectId, ref: User, default: null },
});

GrowingMediumSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("GrowingMedium", GrowingMediumSchema);
