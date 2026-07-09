const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

     generateCaption ,saveCaption

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
module.exports = router;