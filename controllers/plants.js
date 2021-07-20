const cloudinary = require("../middleware/cloudinary");
const Plant = require("../models/Plant");

module.exports = {  
  getPlotPlants: async (req, res) => {
    try {
      const plants = await Plant.find({ plotID: req.plot._id }).sort( { createdAt: "desc" });
      res.render("plot.ejs", { plants: plants, plot: req.plot, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPlantDetails: async (req, res, next, id) => {
    try {
    req.plant = await Plant.findById(id);
    console.log(req.plant);
    next();
    } catch (err) {
      next(err);
    }
},
  getPlant: async (req, res) => {
    try {
      const plant = await Plant.findById(req.params.id);
      res.render("plant.ejs", { plant: plant, plot: req.plot, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createPlant: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path,
      { aspect_ratio: "16:9", gravity: "auto", crop: "fill" },
      function(error, result) { console.log(result, error); });

      const plant = await Plant.create({
        nameCommon: req.body.plantName,
        nameSCI: req.body.plantNameSCI,
        image: result.secure_url,
        imageProviderId: result.public_id,
        light: req.body.light,
        water: req.body.water,
        soil: req.body.soil,
        height: `${req.body.minHeight} - ${req.body.maxHeight} ${req.body.heightInc}`,
        spread: `${req.body.minSpread} - ${req.body.maxSpread} ${req.body.spreadInc}`,
        zoneMin: req.body.zoneMin,
        zoneMax: req.body.zoneMax,
        bloomSeason: `${req.body.seasonStart} - ${req.body.seasonEnd}`,
        nativeOrigin: req.body.nativeOrigin,
        planted: {
            status: req.body.plantedStatus,
            year: req.body.yearPlanted,
            season: req.body.seasonPlanted,
        },
        numPlanted: req.body.numPlanted,
        health: req.body.health,
        pests: req.body.pests,
        notes: req.body.notes,
        plotID: req.body.plotID,
        user: req.user,
      });
      console.log("Plant has been added!");
      res.redirect("/plot/" + req.body.plotID);
    } catch (err) {
      console.log(err);
    }
  },
  getPlantEditor: async (req, res) => {
    try {
      // const plant = await Plant.findById(req.params.id);
      res.render("editPlant.ejs", { plant: req.plant });
    } catch (err) {
      console.log(err);
    }
  },
  editPlant: async (req, res) => {
    console.log(req)
    try {
      await Plant.findOneAndUpdate(
        { _id: req.params.id },
      {$set:
        {
          nameCommon: req.body.plantName,
          nameSCI: req.body.plantNameSCI,
          // image: result.secure_url,
          // imageProviderId: result.public_id,
          light: req.body.light,
          // water: req.body.water,
          soil: req.body.soil,
          height: `${req.body.minHeight} - ${req.body.maxHeight} ${req.body.heightInc}`,
          spread: `${req.body.minSpread} - ${req.body.maxSpread} ${req.body.spreadInc}`,
          zoneMin: req.body.zoneMin,
          zoneMax: req.body.zoneMax,
          bloomSeason: `${req.body.seasonStart} - ${req.body.seasonEnd}`,
          nativeOrigin: req.body.nativeOrigin,
          status: req.body.status,
          yearPlanted: req.body.yearPlanted,
          numPlanted: req.body.numPlanted,
          health: req.body.health,
          notes: req.body.notes,
          }
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
      await cloudinary.uploader.destroy(plant.imageProviderId);
      // Delete plant from db
      await Plant.remove({ _id: req.params.id });
      console.log("Deleted Plant");
      res.redirect("/plot/" + plant.plotID);
    } catch (err) {
      res.redirect("/plot");
    }
  },
};
