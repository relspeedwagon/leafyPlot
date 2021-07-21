const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: false,
    },
    // add add'l model/object ref for multiple photos?
    image: {
        type: String,
        required: false,
    },
    imageProviderId: {
        type: String,
        required: false,
    },
    notes: {
        type: String,
        required: false,
    },
    public: {
        type: Boolean,
        default: false,
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

module.exports = mongoose.model("Collection", CollectionSchema);