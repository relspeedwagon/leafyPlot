const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const plotsController = require("../controllers/plots");
// const collsController = require("../controllers/collections");
const plantsController = require("../controllers/plants");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, plotsController.getUserPlots);
router.get("/all-plants", ensureAuth, plantsController.getUserPlants);
router.get("/start-plot", ensureAuth, plotsController.getPlotCreate);
router.get("/start-collection", ensureAuth, plotsController.getCollCreate);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
