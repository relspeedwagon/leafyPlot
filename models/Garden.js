const mongoose = require("mongoose");

const GardenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    season: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        require: false,
    },
    cloudinaryId: {
        type: String,
        require: true,
    },
    numPlants: {
        type: Number,
        required: false,
    },
    plants: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plant",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Garden", GardenSchema);