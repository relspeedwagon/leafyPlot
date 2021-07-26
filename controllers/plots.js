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

  getPlotEditor: async (req, res) => {
    try {
      res.render("edit-plot.ejs", { plot: req.plot, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  editPlot: async (req, res) => {
    try {
      await Plot.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.plotName,
          seasonID: req.body.seasonID,
          desc: req.body.description,
          // image: result.secure_url,
          // imageProviderId: result.public_id,
          zone: req.body.zone,
          location: req.body.location,
          avgSun: req.body.avgSun,
          soilType: req.body.soilType,
          notes: req.body.notes,
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
      // Find plot by id
      let plot = await Plot.findById({ _id: req.params.id });
      let plotPlants = await Plant.find({ plotID: req.params.id });
      let plantImgIds = plotPlants.map(p=> p.imageProviderId);

      // Delete plot image from cloudinary
      await cloudinary.uploader.destroy(plot.imageProviderId);

      await cloudinary.api.delete_resources(plantImgIds,
      function(error, result) {console.log(result, error); });

      // Delete plot from db
      await Plot.deleteOne({ _id: req.params.id });
      await Plant.deleteMany(  {
        _id: {
          $in: plotPlants
        }
      });
      console.log("Deleted Plot and Plants");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
