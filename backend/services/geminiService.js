const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateCaptions = async (post) => {

    const prompt = `
        You are an Instagram content strategist.

        Generate 3 different Instagram captions and 10 relevant hashtags.

        Campaign:
        ${post.campaignName}

        Topic:
        ${post.topic}

        Context:
        ${post.context}

        Tone:
        ${post.tone}

        Audience:
        ${post.targetAudience}

        Keywords:
        ${post.keywords.join(", ")}

        Return ONLY valid JSON.

        Example:

        {
        "captions":[
            "...",
            "...",
            "..."
        ],
        "hashtags":[
            "#fitness",
            "#gym"
        ]
        }
        `;

    const response = await ai.models.generateContent({

        model: "gemini-2.5-flash",

        contents: prompt

    });

    return response.text;

};

module.exports = {

    generateCaptions

};