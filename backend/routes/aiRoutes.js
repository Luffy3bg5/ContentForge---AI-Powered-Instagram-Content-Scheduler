const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

     generateCaption ,saveCaption ,generatePostImage ,saveImage , generateMusicController ,saveMusic ,getYoutubeLink

} = require("../controllers/aiController");

router.post(
    "/:id/generate-caption",
    authMiddleware,
    generateCaption
);

router.put(

    "/:id/save-caption",

    authMiddleware,

    saveCaption

);

router.post(

    "/:id/generate-image",

    authMiddleware,

    generatePostImage

);

router.put(
    "/:id/save-image",
    authMiddleware,
    saveImage
);

router.post(
"/youtube",
authMiddleware,
getYoutubeLink
);


router.post("/:id/generate-music",authMiddleware,generateMusicController);

router.put("/:id/save-music",authMiddleware,saveMusic);
module.exports = router;