const mongoose = require("mongoose");

const GardenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    seasonID: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        require: false,
    },
    //imageProviderId:
    cloudinaryId: {
        type: String,
        require: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Garden", GardenSchema);