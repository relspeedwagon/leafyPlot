const cloudinary = require("../middleware/cloudinary");
const Plant = require("../models/Plant");

module.exports = {  
  getPlotPlants: async (req, res) => {
    try {
      const plants = await Plant.find({ plotID: req.plot._id }).sort( { createdAt: "desc" });
      res.render("plot.ejs", { plants: plants, plot: req.plot });
    } catch (err) {
      console.log(err);
    }
  },
  
  // getPlotPlants: async (req, res) => {
  //   try {
  //     res.locals.plotID = req.params.id;
  //     const plants = await Plant.find({ plotID: req.params.id }).sort( { createdAt: "desc" }).lean();
  //     res.render("plot.ejs", { plants: plants, plotID: req.params.id });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

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
        imageProviderId: result.public_id,
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
        plotID: req.body.plotID,
        user: req.user,
      });
      console.log("Plant has been added!");
      res.redirect("/plot/" + req.body.plotID);
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
          // imageProviderId: result.public_id,
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
