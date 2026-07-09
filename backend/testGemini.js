require("dotenv").config();

const {

    generateCaptions

} = require("./services/geminiService");

(async () => {

    const result = await generateCaptions({

        campaignName: "Summer Fitness",

        topic: "Fitness",

        context: "Promoting healthy workouts for beginners.",

        tone: "Motivational",

        targetAudience: "College Students",

        keywords: [

            "fitness",

            "gym",

            "health"

        ]

    });

    console.log(result);

})();