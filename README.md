<!-- adapted from https://github.com/acagastya/enwnbot/blob/master/README.md -->
Converts MediaWiki [[links]] and {{templates}} to links, informs important events from wiki, handles announces review queue, and under review, and handles when they last saw a given user.

# Installation

To run this project, run the following commands after cloning it.

```sh
cd <DIR>
yarn # or `npm i`
yarn start # or `npm run start`
```

# Configuration

Use the `config.js` to configure the bot.  It expects the following variables:

- `channels`: the channels the bot should join.
- `ircBotName`: IRC username of the bot.
- `ircServer`: IRC server.
- `RCAPI`: Wiki's stream for recent changes.
- `RQAPI`: API endpoint to get review queue.
- `URAPI`: API endpoint to get under review articles.
- `URL`:  This is URL of a wiki page sans the title.  (see below)
- `wiki`: the wiki identifier used to filter the recent changes stream.

Sample `config.js` looks like:

```js
module.exports = {
  channels: ["#my-wiki-channel", "##wiki-informal-channel"],
  ircBotName: "wikilinkbot",
  ircServer: "chat.freenode.net",
  RCAPI: "https://stream.wikimedia.org/v2/stream/recentchange",
  RQAPI: "https://en.wikinews.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Review&format=json&cmsort=timestamp&cmprop=timestamp|ids|title",
  URAPI: "https://en.wikinews.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Under%20review&format=json&cmsort=timestamp&cmprop=title|timestamp",
  URL: "https://en.wikinews.org/w/index.php?title=",
  wiki: "enwikinews"
};
```

**Note:** In case if you do not want the wikilinks and templates in your message to be be announced by the bot, add `--ignore` at the end of the message.

To access Review Queue, and articles under review, send this message in the channel: `<ircBotName> !RQ` and `<ircBotName> !UR` respectively.

To find when was a user last active in a channel, send `@seen <username>` in that channel.
