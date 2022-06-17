import mongoose from "mongoose";

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

export default mongoose.model("GrowingMedium", GrowingMediumSchema);
