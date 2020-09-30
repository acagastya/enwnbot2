module.exports = {
  channels: ["#wikinews", "#wikinews-en", "#wikinewsie-group"],
  ircBotName: "enwnbot",
  ircServer: "irc.freenode.net",
  RCAPI: "https://stream.wikimedia.org/v2/stream/recentchange",
  RQAPI:
    "https://en.wikinews.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Review&format=json&cmsort=timestamp&cmprop=timestamp|ids|title",
  URAPI:
    "https://en.wikinews.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Under%20review&format=json&cmsort=timestamp&cmprop=title|timestamp",
  URL: "https://en.wikinews.org/w/index.php?title=",
  wiki: "enwikinews"
};
