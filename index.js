const fs = require("fs");
const path = require("path");
const https = require('https');
const Discord = require('discord.js');

// User config from your JSON at the root directory
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), "utf-8"));
const discordClient = new Discord.Client();
let discordReady = false;

// Fetches an image from a sub reddit using their .json end point and passes it to a callback function
function fetchImageFromReddit(subreddit, criteria, cb) {
    const imageFormats = ["jpg", "jpeg", "png", "gif", "bmp"]; // Allowed formats
    // Request
    https.get(`https://www.reddit.com/r/${subreddit}/${criteria}/.json`, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on("data", (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        resp.on("end", () => {
            const finalJSON = JSON.parse(data);
            let imageFound = false;
            let imageUrl = "";
            // Randomly picks a post and tries to extract it's image (direct URL), if fail tries again until succeeds.
            while (!imageFound) {
                const rand = Math.ceil(Math.random() * 10000 % finalJSON.data.children.length);
                imageUrl = finalJSON.data.children[rand].data.url;
                const urlExtension = imageUrl.split(".");
                if (imageFormats.includes(urlExtension.pop())) {
                    imageFound = true;
                }
            }
            // Returns the image url
            cb(imageUrl, null);
        });

    }).on("error", (err) => {
        console.error(`Error: ${err.message}`);
        cb(null, err);
    });
}

// Discord module.
discordClient.on('ready', () => {
    console.log(`Logged in Discord as ${discordClient.user.tag}!`);
    discordClient.targetRoom = discordClient.channels.find(x => x.id == config.channelId);
    discordReady = true;

    if (!discordClient.targetRoom) {
        console.error("No Discord target room found, check the room id in configs or if the bot can actually see it.");
        process.exit(1);
    }
});

// Logins in to Discord
discordClient.login(config.token);

// Fetches the image from a subreddit and waits for Discord to be ready so it can be sent to the appropriate text channel.
fetchImageFromReddit(config.subreddit, config.criteria, (url, error) => {
    if (!error) {
        let intervalId = setInterval(() => {
            if (discordReady) {
                discordClient.targetRoom.send(url).then(() => { process.exit(0); });
                clearInterval(intervalId);
            }
        }, 1000);
    } else {
        console.error("An error has happened while the image was being fetched from the requested subreddit.");
    }
});
