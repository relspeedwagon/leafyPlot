const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const plantsController = require("../controllers/plants");
const { ensureAuth } = require("../middleware/auth");

router.param("id", plantsController.getPlantDetails);

router.get("/:id", ensureAuth, plantsController.getPlant);

router.post(
  "/create-plant",
  upload.single("file"),
  plantsController.createPlant
);

router.get("/:id/edit", plantsController.getPlantEditor);

router.post(
  "/edit-image/:id",
  upload.single("file"),
  plantsController.editPlantImage
);

router.post(
  "/edit-plant/:id",
  upload.single("file"),
  plantsController.editPlant
);

router.delete("/delete-plant/:id", plantsController.deletePlant);

module.exports = router;
