const cloudinary = require("../middleware/cloudinary");
const Plant = require("../models/Plant");

module.exports = {
  //can get plot.ejs to render by changing "req.plot.id" to "req.id", but then still no access to plot object 
  getPlants: async (req, res) => {
    try {
      const plants = await Plant.find({ plotID: req.params.id }).sort( { createdAt: "desc" }).lean();
      res.render("plot.ejs", { plants: plants, plotID: req.params.id });
    } catch (err) {
      console.log(err);
    }
  },

  getPlant: async (req, res) => {
    try {
      const plant = await Plant.findById(req.params.id);
      res.render("plant.ejs", { plant: plant, plot: req.plot });
    } catch (err) {
      console.log(err);
    }
  },
  // getAddPlant: (req, res) => {
  //   res.render("addPlant.ejs");
  // },
  createPlant: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      const plant = await Plant.create({
        nameCommon: req.body.plantName,
        nameSCI: req.body.plantNameSCI,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        light: req.body.light,
        water: req.body.water,
        spread: req.body.spread,
        minHeight: req.body.minHeight,
        maxHeight: req.body.maxHeight,
        nativeOrigin: req.body.nativeOrigin,
        zoneMin: req.body.zoneMin,
        zoneMax: req.body.zoneMax,
        numPlanted: req.body.numPlanted,
        status: req.body.status,
        notes: req.body.notes,
        plotID: req.params.id,
      });
      console.log("Plant has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  editPlant: async (req, res) => {
    try {
      await Plant.findOneAndUpdate(
        { _id: req.params.id },
        {
          nameCommon: req.body.plantName,
          nameSCI: req.body.plantNameSCI,
          // image: result.secure_url,
          // cloudinaryId: result.public_id,
          light: req.body.light,
          water: req.body.water,
          spread: req.body.spread,
          minHeight: req.body.minHeight,
          maxHeight: req.body.maxHeight,
          nativeOrigin: req.body.nativeOrigin,
          zone: req.body.zone,
          numPlanted: req.body.numPlanted,
          status: req.body.status,
          notes: req.body.notes,
        }
      );
      console.log("Plant has been updated");
      res.redirect(`/plant/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePlant: async (req, res) => {
    try {
      // Find plant by id
      let plant = await Plant.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(plant.cloudinaryId);
      // Delete plant from db
      await Plant.remove({ _id: req.params.id });
      console.log("Deleted Plant");
      res.redirect("/plot");
    } catch (err) {
      res.redirect("/plot");
    }
  },
};
