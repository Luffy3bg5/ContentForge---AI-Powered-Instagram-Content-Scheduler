const {

    generateCaptions

} = require("../services/geminiService");

const Post = require("../models/Post");

const generateCaption = async(req , res)=>{
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

        const  aiResponse = await  generateCaptions(post) ;

        //Gemini may  return JSON inside  ```json 

        const  cleaned = aiResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
        
           const result = JSON.parse(cleaned);

        res.status(200).json({

            success: true,

            captions: result.captions,

            hashtags: result.hashtags

        });

    } catch (error) {
        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to generate captions."

        });

         
    }
}

const saveCaption = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({
                success: false,
                message: "Post not found."
            });

        }

        if (post.user.toString() !== req.user) {

            return res.status(403).json({
                success: false,
                message: "Access denied."
            });

        }

        post.caption = req.body.caption;

        post.hashtags = req.body.hashtags;

        await post.save();

        res.status(200).json({

            success: true,

            message: "Caption saved.",

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

module.exports = { generateCaption , saveCaption} ;