const cloudinary = require("../middleware/cloudinary");
const Plant = require("../models/Plant");

module.exports = {
  // getGarden: async (req, res) => {
  //   try {
  //     const plants = await Plant.find({ garden: req.garden.id }).sort({ createdAt: "desc" }).lean();
  //     res.render("garden.ejs", { plants: plants, garden: req.garden });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  // getFeed: async (req, res) => {
  //   try {
  //     const posts = await Post.find().sort({ createdAt: "desc" }).lean();
  //     res.render("feed.ejs", { posts: posts });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  getPlant: async (req, res) => {
    try {
      const plant = await Plant.findById(req.params.id);
      res.render("plant.ejs", { plant: plant, garden: req.garden });
    } catch (err) {
      console.log(err);
    }
  },
  createPlant: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Plant.create({
        nameCommon: req.body.name,
        nameSCI: req.body.nameSCI,
        image: result.secure_url,
        cloudinaryId: result.public_id,
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
        garden: req.garden.id,
      });
      console.log("Plant has been added!");
      res.redirect("/garden");
    } catch (err) {
      console.log(err);
    }
  },
  //-----------------Edit plant
  // likePost: async (req, res) => {
  //   try {
  //     await Post.findOneAndUpdate(
  //       { _id: req.params.id },
  //       {
  //         $inc: { likes: 1 },
  //       }
  //     );
  //     console.log("Likes +1");
  //     res.redirect(`/post/${req.params.id}`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  deletePlant: async (req, res) => {
    try {
      // Find plant by id
      let plant = await Plant.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(plant.cloudinaryId);
      // Delete plant from db
      await Plant.remove({ _id: req.params.id });
      console.log("Deleted Plant");
      res.redirect("/garden");
    } catch (err) {
      res.redirect("/garden");
    }
  },
};
