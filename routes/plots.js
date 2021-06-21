const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const plotsController = require("../controllers/plots");
const plantsController = require("../controllers/plants");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/:id", ensureAuth, plantsController.getPlants);

router.post("/createPlot", upload.single("file"), plotsController.createPlot);

router.put("/editPlot/:id", plotsController.editPlot);

router.delete("/deletePlot/:id", plotsController.deletePlot);

module.exports = router;
