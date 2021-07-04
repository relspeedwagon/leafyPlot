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
    
    imageProviderId: {
        type: String,
        required: false,
    },
    light: {
        type: String,
        required: false,
    },
    water: {
        type: String,
        required: false,
    },
    soil: {
        type: String,
        required: false,
    },
    spread: {
        type: String,
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
    bloomSeason: {
        type: Array,
        required: false,
    },
    nativeOrigin: {
        type: String,
        required: false,
    },
    zoneMin: {
        type: String,
        required: false,
    },
    zoneMax: {
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
    plotID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plot",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

//add peak bloom range

module.exports = mongoose.model("Plant", PlantSchema);