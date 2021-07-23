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
    height: {
        min: {type: String, required: false},
        max: {type: String, required: false},
        inc: {type: String, required: false},
    },
    spread: {
        min: {type: String, required: false},
        max: {type: String, required: false},
        inc: {type: String, required: false},
    },
    zone: {
        min: {type: String, required: false},
        max: {type: String, required: false},
    },
    
    bloomSeason: {
        start: {type: String, required: false},
        end: {type: String, required: false},
    },
    nativeOrigin: {
        type: String,
        required: false,
    },
    planted: {
        status: {String, required: false},
        year: {Number, required: false},
        season: {String, required: false},
    },
    numPlanted: {
        type: Number,
        required: false,
    },
    health: {
        type: String,
        required: false,
    },
    pests: {
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