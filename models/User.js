const mongoose = require("mongoose");

const Plant = require("./Plant");
const GrowingMedium = require("./GrowingMedium");

const { Schema } = mongoose;

const UserSchema = new Schema({
    username: String,
    passwordHash: String,
    plants: [{ type: mongoose.Schema.Types.ObjectId, ref: Plant }],
    growingMediums: [{ type: mongoose.Schema.Types.ObjectId, ref: Plant }],
});

UserSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

module.exports = mongoose.model("User", UserSchema);
