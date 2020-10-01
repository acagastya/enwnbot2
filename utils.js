const fetch = require("node-fetch");

const { ircBotName, URL, wiki } = require("./config");

async function fetchData(URI) {
  const res = {};
  try {
    const data = await fetch(URI);
    const parsed = await data.json();
    res.list = parsed.query.categorymembers;
  } catch (error) {
    res.error = true;
    console.warn("Error in fetchData:", error);
  }
  return res;
}

function fullUrl(title = "") {
  const fixedTitle = title.replace(/\?/g, "%3F"); // fix the title for '?'
  let [main, anchor] = fixedTitle.split("#");
  main = main.replace(/ /g, "%20");
  if (anchor) anchor = anchor.replace(/ /g, "_");
  else main = main.replace(/%20/g, "_");
  let final = main;
  if (anchor) final += `%23${anchor}`;
  return `${URL}${final}`;
}

function getCategory(title = "") {
  return title.replace(/^Category:/, "");
}

function getFullLink(link) {
  const len = link.length;
  const trimmed = link.substr(2, len - 4);
  const finalUrl = fullUrl(trimmed);
  return finalUrl;
}

function getFullTemplate(template) {
  const len = template.length;
  const word = template
    .substr(2, len - 4)
    .split("|")[0]
    .replace(/ /g, "%20")
    .replace(/\?/g, "%3F");
  return `${URL}Template:${word}`;
}

const linkRegex = /\[{2}(.*?)\]{2}/g;

function streamError(event) {
  const knownError = { type: "error" };
  const knownErrStr = JSON.stringify(knownError);
  const eventStr = JSON.stringify(event);
  if (eventStr != knownErrStr) {
    ircClient.say("acagastya", eventStr + "\n --- error");
    console.error("--- Encountered error", event);
  }
}

function streamMessage(event) {
  let msg = "";
  const change = JSON.parse(event.data);
  const { comment, title, type, user } = change;
  if (change.wiki == wiki && type == "categorize") {
    const category = getCategory(title);
    const pageRegex = /\[\[:(.*)\]\]/;
    const page = comment.match(pageRegex)[1];
    switch (category) {
      case "Editing": {
        if (comment.includes("added"))
          msg = `Attention!  ${user} is now {{editing}} [[${page}]].`;
        else msg = `[[${page}]] is no longer under {{editing}}.`;
        break;
      }
      case "Developing": {
        if (comment.includes("added"))
          msg = `${user} may be working on [[${page}]].`;
        else msg = `${user} has removed [[${page}]] from {{develop}}.`;
        break;
      }
      case "Review": {
        if (comment.includes("added"))
          msg = `${user} has submitted [[${page}]] for review.`;
        else msg = `${user} has removed [[${page}]] from review.`;
        break;
      }
      case "Under review": {
        if (comment.includes("added"))
          msg = `${user} is reviewing [[${page}]].`;
        else msg = `${user} is no longer reviewing [[${page}]].`;
        break;
      }
      case "Peer reviewed/Not ready": {
        const failedArticleRegex = /^\[\[:Talk:(.*)\]\]/;
        const failedArticle = comment.match(failedArticleRegex)[1];
        msg = `${user} has not-ready'd the [[${failedArticle}]] article.`;
        break;
      }
      case "Abandoned": {
        if (comment.includes("added"))
          msg = `${user} has marked [[${page}]] as abandoned.`;
        break;
      }
      case "Published": {
        if (comment.includes("added"))
          msg = `${user} just published [[${page}]].`;
        break;
      }
      case "Archived": {
        if (comment.includes("added"))
          msg = `${user} has archived [[${page}]].`;
        else msg = `${user} has unarchived [[${page}]].`;
        break;
      }
    }
    return msg;
  }
}

const templateRegex = /\{{2}(.*?)\}{2}/g;

const thanksRegex = new RegExp(
  `(thanks?|thank you|thankyou),? ${ircBotName}`,
  "i"
);

module.exports = {
  fetchData,
  fullUrl,
  getFullLink,
  getFullTemplate,
  linkRegex,
  streamError,
  streamMessage,
  templateRegex,
  thanksRegex
};
