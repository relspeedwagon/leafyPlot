const cloudinary = require("../middleware/cloudinary");
const Plant = require("../models/Plant");
const Plot = require("../models/Collection");

module.exports = {
    getCollCreate: (req, res) => {
        res.render("start-collection.ejs", { user: req.user });
    },

    createColl: async (req, res) => {
        try {
          // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path,
            { aspect_ratio: "16:7", gravity: "auto", crop: "fill" },
            function(error, result) { console.log(result, error); });
    
        await Collection.create({
            name: req.body.collName,
            desc: req.body.desc,
            image: result.secure_url,
            imageProviderId: result.public_id,
            notes: req.body.notes,
            public: req.body.public,
            user: req.user.id,
        });
        console.log("Collection has been added!");
            res.redirect("/profile");
        } catch (err) {
            console.log(err);
        }
    },
};
