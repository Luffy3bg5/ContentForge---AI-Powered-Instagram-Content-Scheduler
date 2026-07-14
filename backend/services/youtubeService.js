const axios = require("axios");

const searchYoutube = async (query) => {

    const response = await axios.get(

        "https://www.googleapis.com/youtube/v3/search",

        {
            params:{

                part:"snippet",

                maxResults:1,

                q:query,

                type:"video",

                key:process.env.YOUTUBE_API_KEY

            }
        }

    );

    const items = response.data.items;

    if(items.length===0){

        return null;

    }

    const videoId = items[0].id.videoId;

    return `https://www.youtube.com/watch?v=${videoId}`;

};

module.exports={

    searchYoutube

};