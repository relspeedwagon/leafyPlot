const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const plotsController = require("../controllers/plots");
const plantsController = require("../controllers/plants");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.param('id', plotsController.getPlotDetails);

router.get("/:id", ensureAuth, plantsController.getPlotPlants);

router.post("/create-plot", upload.single("file"), plotsController.createPlot);

router.put("/edit-plot/:id", plotsController.editPlot);

router.delete("/delete-plot/:id", plotsController.deletePlot);

module.exports = router;


// router.param('plotId', async (req, res, next, id) => {
//     req.plot = await Plot.findById(id);
//     next();
//   });
  
//   router.get('/plots/:plotId', (req, res) => {
//     const plants = Plant.find({ plotId: req.plot._id }); // this can also be `req.params.plotId`
//     res.render('plot', { plants, plot: req.plot });
//   });

// router.param('plotId', controller.plotMiddleware);
// router.param('/plots/:plotId', controller.getPlotPage);