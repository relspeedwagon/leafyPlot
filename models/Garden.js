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
    // add add'l model/object ref for multiple photos?
    image: {
        type: String,
        required: false,
    },
    //imageProviderId:
    cloudinaryId: {
        type: String,
        required: false,
    },
    zone: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    public: {
        type: Boolean,
        default: false,
    }
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