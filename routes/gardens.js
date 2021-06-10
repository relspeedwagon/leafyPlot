const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const gardensController = require("../controllers/gardens");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/:id", ensureAuth, gardensController.getGarden);

router.post("/createGarden", upload.single("file"), gardensController.createGarden);

router.put("/editGarden/:id", gardensController.editGarden);

router.delete("/deleteGarden/:id", gardensController.deleteGarden);

module.exports = router;
