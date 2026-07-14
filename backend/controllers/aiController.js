const { generateCaptions , generateMusic } =require("../services/geminiService");

const { searchYoutube } = require("../services/youtubeService");

const Post = require("../models/Post");

const { generateImage } = require("../services/imageService");

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

const saveImage = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success:false,
                message:"Post not found."
            });
        }

        if(post.user.toString() !== req.user){
            return res.status(403).json({
                success:false,
                message:"Access denied."
            });
        }

        post.imageUrl = req.body.imageUrl;
        post.imagePrompt = req.body.imagePrompt;

        await post.save();

        res.status(200).json({
            success:true,
            message:"Image saved.",
            post
        });

    } catch(err){

        console.error(err);

        res.status(500).json({
            success:false,
            message:"Server Error"
        });

    }

};
const generatePostImage = async (req, res) => {

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

        const imagePrompt = `
                Create a realistic Instagram image.

                Campaign:
                ${post.campaignName}

                Topic:
                ${post.topic}

                Context:
                ${post.context}

                Tone:
                ${post.tone}

                Caption:
                ${post.caption}
                `;

        const imageUrl =
            await generateImage(imagePrompt);

        res.status(200).json({

            success: true,

            imagePrompt,

            imageUrl

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Image generation failed."

        });

    }

};

const generateMusicController = async (req, res) => {
        console.log("===== generateMusicController HIT =====");
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

        const aiResponse = await generateMusic(post);
        console.log(aiResponse);

        const cleaned = aiResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        console.log("Cleaned:");
        console.log(cleaned);

        const result = JSON.parse(cleaned);

        console.log("Parsed:");
        console.log(result);
        res.status(200).json({

            success: true,

            songs: result.songs

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Music generation failed."

        });

    }

};

const saveMusic = async (req, res) => {

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

        post.music ={
            title : req.body.music.title ,
            artist : req.body.music.artist
        }

        await post.save();

        res.status(200).json({

            success: true,

            message: "Music saved.",

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

const getYoutubeLink = async(req,res)=>{

    try{

        const {song}=req.body;
        const url = await searchYoutube(song);

        res.json({
            success:true,
            url
        });

    }

    catch(err){
        console.error(err);
        res.status(500).json({
            success:false
        });

    }

}
module.exports = { generateCaption , saveCaption , generatePostImage , saveImage  ,generateMusicController ,saveMusic ,getYoutubeLink} ;