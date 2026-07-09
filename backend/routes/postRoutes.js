const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    createPost , getPost ,updatePost , getPosts ,generateCaption

} = require("../controllers/postController");

router.post(
    "/",
    authMiddleware,
    createPost
);

router.get("/",
    authMiddleware ,
    getPosts
);


router.get(
    "/:id",
    authMiddleware,
    getPost
);

router.put(
    "/:id",
    authMiddleware,
    updatePost
);



module.exports = router;