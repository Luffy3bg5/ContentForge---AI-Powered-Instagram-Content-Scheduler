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

// ===============================
// Get Single Post
// GET /api/posts/:id
// ===============================

const getPost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({

                success: false,

                message: "Post not found."

            });

        }

        // Prevent users from accessing others' posts
        if (post.user.toString() !== req.user) {

            return res.status(403).json({

                success: false,

                message: "Access denied."

            });

        }

        res.status(200).json({

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


// ===============================
// Update Post
// PUT /api/posts/:id
// ===============================

const updatePost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({

                success: false,

                message: "Post not found."

            });

        }

        // Ensure the logged-in user owns this post
        if (post.user.toString() !== req.user) {

            return res.status(403).json({

                success: false,

                message: "Access denied."

            });

        }

        Object.assign(post, req.body);

        await post.save();

        res.status(200).json({

            success: true,

            message: "Post updated successfully.",

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


const getPosts =  async (req , res)=>{
        try {
            const  posts = await Post.find({
                user : req.user 
            }).sort({
                createdAt : -1 
            });

            res.status(200).json({
                success : true ,
                count : posts.length ,
                posts
            });

        } catch (error) {
            console.error(error) ;
            res.status(500).json({
                success : false ,
                message : "Server Error"
            });
        }
}


module.exports = {

    createPost , getPost ,updatePost , getPosts 

};