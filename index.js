const ES = require("eventsource");

const irc = require("irc");

const moment = require("moment-timezone");

const {
  channels,
  ircBotName,
  ircServer,
  RCAPI,
  RQAPI,
  URAPI
} = require("./config");

const {
  fetchData,
  fullUrl,
  getFullLink,
  getFullTemplate,
  linkRegex,
  streamError,
  streamMessage,
  templateRegex,
  thanksRegex
} = require("./utils");

const ircClient = new irc.Client(ircServer, ircBotName, { channels });

console.log("Connecting to the event stream...");

const eventSource = new ES(RCAPI);

eventSource.onopen = function(event) {
  console.log("--- Opened connection.");
};

eventSource.onerror = streamError;

eventSource.onmessage = function(event) {
  let msg = streamMessage(event);
  if (msg) channels.forEach(channel => ircClient.say(channel, msg));
};

ircClient.addListener("error", function(message) {
  console.log("error: ", message);
});

ircClient.addListener("pm", function(sender, msg) {
  if(msg == "KILL" && ['pizero', 'pizero|afk', 'acagastya'].indexOf(sender) >= 0) process.abort();
  ircClient.say(sender, "I am a bot.");
});

ircClient.addListener("message", groupChat);

function groupChat(sender, channel, msg) {
  if (thanksRegex.test(msg))
    ircClient.say(channel, `You are welcome, ${sender}.`);
  if (msg.includes(`${ircBotName} !RQ`)) announceRQ(sender, channel);
  if (msg.includes(`${ircBotName} !UR`)) announceUR(sender, channel);

  const links = msg.match(linkRegex);
  const templates = msg.match(templateRegex);

  if (!msg.endsWith("--ignore") && links) {
    const nonEmptyLinks = links.filter(el => el.length > 4);
    const fullLinks = nonEmptyLinks.map(getFullLink);
    if (fullLinks.length) sayUrls(false, fullLinks, channel);
  }

  if (!msg.endsWith("--ignore") && templates) {
    const nonEmptyTemplates = templates.filter(el => el.length > 4);
    const fullLinks = nonEmptyTemplates.map(getFullTemplate);
    if (fullLinks.length) sayUrls(false, fullLinks, channel);
  }
}

async function announceRQ(sender, channel) {
  const data = await fetchData(RQAPI);

  if (data.error)
    ircClient.say(
      channel,
      `Error occurred, ${sender}.  Try this instead: "[[CAT:REV]]"`
    );
  else {
    const { list } = data;
    if (!list.length)
      ircClient.say(channel, `Review queue is empty, ${sender}.`);
    else {
      ircClient.say(
        channel,
        `${list.length} articles to review, ${sender}.  They are:`
      );
      const titles = list.map(({ title }) => title);
      const times = list.map(({ timestamp }) => moment().to(moment(timestamp)));
      const urls = titles.map(fullUrl);
      sayUrls(true, urls, channel, titles, times);
    }
  }
}

async function announceUR(sender, channel) {
  const data = await fetchData(URAPI);

  if (data.error)
    ircClient.say(
      channel,
      `Error occurred, ${sender}.  Try this instead: "[[CAT:Under Review]]"`
    );
  else {
    const { list } = data;
    if (!list.length)
      ircClient.say(channel, `No articles are under review, ${sender}.`);
    else {
      client.say(
        channel,
        `${list.length} articles are under review, ${sender}.  They are:`
      );
      const titles = list.map(({ title }) => title);
      const times = list.map(({ timestamp }) => moment().to(moment(timestamp)));
      const urls = titles.map(fullUrl);
      sayUrls(true, urls, channel, titles, times);
    }
  }
}

function sayUrls(
  review = false,
  urlList,
  channel,
  titles = [],
  times = [],
  pending = []
) {
  urlList.forEach((url, idx) => {
    let msg = url;
    if (review) msg += " submitted for review";
    if (times.length) msg += ` *${times[idx]}*`;
    if (titles.length) msg += ` -- ${titles[idx]}`;
    if (pending[idx]) msg += " *under review*";
    ircClient.say(channel, msg);
  });
}
