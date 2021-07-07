const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const plantsController = require("../controllers/plants");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.param('id', plantsController.getPlantDetails);

router.get("/:id", ensureAuth, plantsController.getPlant);

router.post("/createPlant", upload.single("file"), plantsController.createPlant);

router.get("/:id/edit", plantsController.getPlantEditor);

router.post("/editPlant/:id", plantsController.editPlant);

router.delete("/deletePlant/:id", plantsController.deletePlant);

module.exports = router;
