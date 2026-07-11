
async function generateImage(prompt) {

    const encodedPrompt = encodeURIComponent(prompt);

    const imageUrl =
        `https://image.pollinations.ai/prompt/${encodedPrompt}`;

    return imageUrl;

}

module.exports = {

    generateImage

};