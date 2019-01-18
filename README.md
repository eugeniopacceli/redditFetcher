# redditFetcher
A run once script that fetches an image from some subreddit and posts to Discord.

# Configuration
The configuration for this script requires a valid bot credential for Discord (they call it token), a subreddit name, a criteria to specify which subset of posts the bot will query the subreddit for (ie new, controversial, hot, etc) and a valid Discord text chat room that the bot can write to so it can send the extracted image url.

Check `config.example.json` for a template.

# TO DO
* Support other media.

# To run
Tested on Node.Js 11.6.0.

* Run `npm install`;
* Copy `config.example.json` in `config.json` and set it up properly;
* `node index.js` runs the script.

You can combine this with cronjob to create a periodic task.

# Reference
* [Discord.Js](https://discord.js.org/)
* [Discord API Specs](https://discordapp.com/developers/docs/intro)