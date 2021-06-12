const cloudinary = require("../middleware/cloudinary");
const Garden = require("../models/Garden");

module.exports = {
  getGardens: async (req, res) => {
    try {
      const gardens = await Garden.find({ user: req.user.id });
      res.render("profile.ejs", { gardens: gardens, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  // getFeed: async (req, res) => {
  //   try {
  //     const posts = await Post.find().sort({ createdAt: "desc" }).lean();
  //     res.render("feed.ejs", { posts: posts });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  getGarden: async (req, res) => {
    try {
      const garden = await Garden.findById(req.params.id);
      res.render("editGarden.ejs", { garden: garden, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createGarden: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Garden.create({
        name: req.body.gardenName,
        seasonID: req.body.seasonID,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        zone: req.body.zone,
        location: req.body.location,
        public: req.body.public,
        user: req.user.id,
      });
      console.log("Garden has been added!");
      res.redirect("/home");
    } catch (err) {
      console.log(err);
    }
  },
  editGarden: async (req, res) => {
    try {
      await Garden.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.gardenName,
          seasonID: req.body.seasonID,
          image: result.secure_url,
          //image mgmt to be added
          zone: req.body.zone,
          location: req.body.location,
          public: req.body.public,
        }
      );
      console.log("Garden has been updated");
      res.redirect(`/garden/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteGarden: async (req, res) => {
    try {
      // Find post by id
      let garden = await Garden.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(garden.cloudinaryId);
      // Delete post from db
      await Garden.remove({ _id: req.params.id });
      console.log("Deleted Garden");
      res.redirect("/home");
    } catch (err) {
      res.redirect("/home");
    }
  },
};
