const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    campaignName: {
        type: String,
        required: true
    },

    topic: {
        type: String,
        required: true
    },

    context: {
        type: String,
        required: true
    },

    tone: {
        type: String,
        default: "Professional"
    },

    targetAudience: {
        type: String,
        default: ""
    },

    keywords: [{
        type: String
    }],

    additionalNotes: {
        type: String,
        default: ""
    },

    caption: {
        type: String,
        default: ""
    },

    hashtags: [{
        type: String
    }],
    
    imagePrompt: {
            type: String,
            default: ""
        },

    imageUrl: {
            type: String,
            default: ""
        },

    music: {
            title :{
                type : String ,
            },
            artist :{
                type : String ,
                
            }
        },

    status: {
        type: String,
        enum: ["draft", "scheduled", "posted"],
        default: "draft"
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Post", postSchema);