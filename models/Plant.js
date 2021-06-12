const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema({
    nameCommon: {
        type: String,
        required: true,
    },
    nameSCI: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    //imageProviderId:
    cloudinaryId: {
        type: String,
        required: false,
    },
    light: {
        type: String,
        required: false,
    },
    water: {
        type: Number,
        required: false,
    },
    spread: {
        type: Number,
        required: false,
    },
    minHeight: {
        type: Number,
        required: false,
    },
    maxHeight: {
        type: Number,
        required: false,
    },
    nativeOrigin: {
        type: String,
        required: false,
    },
    zone: {
        type: String,
        required: false,
    },
    numPlanted: {
        type: Number,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    notes: {
        type: String,
        required: false,
    },
    garden: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Garden",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Plant", PlantSchema);