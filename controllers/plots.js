const cloudinary = require("../middleware/cloudinary");
const Plot = require("../models/Plot");

module.exports = {
  getPlots: async (req, res) => {
    try {
      const plots = await Plot.find({ user: req.user.id });
      res.render("profile.ejs", { plots: plots, user: req.user });
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
  getPlot: async (req, res) => {
    try {
      const plot = await Plot.findById(req.params.id);
      res.render("plot.ejs", { plot: plot, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPlotCreate: (req, res) => {
    res.render("createPlot.ejs");
  },
  createPlot: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Plot.create({
        name: req.body.plotName,
        seasonID: req.body.seasonID,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        zone: req.body.zone,
        location: req.body.location,
        public: req.body.public,
        user: req.user.id,
      });
      console.log("Plot has been added!");
      res.redirect("/profile");
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
      await cloudinary.uploader.destroy(plot.cloudinaryId);
      // Delete post from db
      await Plot.remove({ _id: req.params.id });
      console.log("Deleted Plot");
      res.redirect("/home");
    } catch (err) {
      res.redirect("/home");
    }
  },
};
