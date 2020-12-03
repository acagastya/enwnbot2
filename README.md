Converts MediaWiki [[links]] and {{templates}} to links.

# Installation

To run this project, run the following commands after cloning it.

```sh
cd <DIR>
yarn # or `npm i`
yarn start # or `npm run start`
```

# Configuration

Use the `config.js` to configure the bot.

- Specify the bot's IRC nick in `botName`. (eg. `linkBot`)
- Mention the list of channels to monitor in `channels`.
- Specify IRC channel in `server`. (eg. `irc.freenode.net`)
- API should be specified in `URL`. (eg. `https://en.wikinews.org/w/index.php?title=`)

Additionally, the bot reports any errors to its maintainers.

- Mention the list of maintainers in the `maintainers` array.
- PM to the bot will not be forwarded to anyone, unless it starts with a particular string mentioned in `report`. If the bot gets a PM which starts with `report`, it will forward the PM to a list of admins. **Note:** This could be abused, so specifying `report` as `/` might be a good idea.
- Specify the list of admins who would like to receive PM of the forwarded message in `admins`.

Sample `config.js` looks like:

```js
const config = {
  admins: ['jdoe', 'samsmith'],
  botName: 'linkBot',
  channels: ['#foo', '##bar'],
  maintainers: ['list', 'of', 'maintainers'],
  report: '!ADMIN',
  server: 'irc.freenode.net',
  URL: 'https://en.wikinews.org/w/index.php?title=',
};
```

**Note:** In case if you do not want the wikilinks and templates in your message to be be announced by the bot, add `--ignore` at the end of the message.
