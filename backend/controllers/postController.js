const Post = require("../models/Post");

const createPost = async (req, res) => {

    try {

        const {

            campaignName,

            topic,

            context,

            tone,

            targetAudience,

            keywords,

            additionalNotes

        } = req.body;

        const post = await Post.create({

            user: req.user,

            campaignName,

            topic,

            context,

            tone,

            targetAudience,

            keywords,

            additionalNotes

        });

        res.status(201).json({

            success: true,

            post

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};

module.exports = {

    createPost

};