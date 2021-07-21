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
