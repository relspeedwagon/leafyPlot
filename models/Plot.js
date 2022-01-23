const mongoose = require("mongoose");

const PlotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  plotType: {
    type: String,
    required: true,
  },
  seasonID: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: false,
  },
  // * ENHANCE: add add'l model/object ref for multiple photos?
  image: {
    type: String,
    required: false,
  },
  imageProviderId: {
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
  avgSun: {
    type: String,
    required: false,
  },
  soilType: {
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

module.exports = mongoose.model("Plot", PlotSchema);
