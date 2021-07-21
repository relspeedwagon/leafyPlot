const cloudinary = require("../middleware/cloudinary");
const Plant = require("../models/Plant");
const Plot = require("../models/Plot");

module.exports = {  
  getUserPlots: async (req, res) => {
    try {
      const plots = await Plot.find({ user: req.user.id, plotType: "plot" }).sort( { createdAt: "desc" });
      const colls = await Plot.find({ user: req.user.id, plotType: "collection" }).sort( { createdAt: "desc" });
      res.render("profile.ejs", { plots: plots, colls: colls, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  getPlotDetails: async (req, res, next, id) => {
      try {
      req.plot = await Plot.findById(id);
      console.log(req.plot);
      next();
      } catch (err) {
        next(err);
      }
  },
  
  getPlotCreate: (req, res) => {
    res.render("create-plot.ejs", { user: req.user });
  },

  getCollCreate: (req, res) => {
    res.render("start-collection.ejs", { user: req.user });
  },

  createPlot: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path,
        { aspect_ratio: "16:7", gravity: "auto", crop: "fill" },
        function(error, result) { console.log(result, error); });

      await Plot.create({
        name: req.body.plotName,
        plotType: req.body.plotType,
        seasonID: req.body.seasonID,
        desc: req.body.description,
        image: result.secure_url,
        imageProviderId: result.public_id,
        zone: req.body.zone,
        location: req.body.location,
        avgSun: req.body.avgSun,
        soilType: req.body.soilType,
        notes: req.body.notes,
        public: req.body.public,
        user: req.user.id,
      });
      console.log("Plot has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },

  // -----------must update with new fields----
  editPlot: async (req, res) => {
    try {
      await Plot.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.plotName,
          seasonID: req.body.seasonID,
          image: result.secure_url,
          //image mgmt to be added
          zone: req.body.zone,
          location: req.body.location,
          public: req.body.public,
        }
      );
      console.log("Plot has been updated");
      res.redirect(`/plot/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePlot: async (req, res) => {
    try {
      // Find post by id
      let plot = await Plot.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(plot.imageProviderId);
      // Delete post from db
      await Plot.remove({ _id: req.params.id });
      console.log("Deleted Plot");
      res.redirect("/home");
    } catch (err) {
      res.redirect("/home");
    }
  },
};
