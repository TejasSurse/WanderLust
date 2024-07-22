const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const lisingController = require("../controllers/listings");
const multer  = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({storage});


router.route("/")
.get(wrapAsync(lisingController.index))
.post( isLoggedIn, upload.single("listing[image]"), wrapAsync(lisingController.create ));
// index route // create rout

// new Route 
router.get("/new", isLoggedIn, (lisingController.newForm) );
// show route
router.get("/:id", wrapAsync(lisingController.show));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(lisingController.edit));
// Update Route
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]") ,validateListing,  wrapAsync(lisingController.update));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync( lisingController.delete));


module.exports = router;
