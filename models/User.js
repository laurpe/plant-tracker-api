const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
    username: String,
    password: String,
});

UserSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("User", UserSchema);
