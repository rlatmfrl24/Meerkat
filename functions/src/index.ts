import * as functions from "firebase-functions";
import * as crawl from "./rss/crawl";
import * as foogle from "./rss/foogle";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const crawlRssFeeds = functions.https.onRequest(
  async (request, response) => {
    functions.logger.info("[Test]::Feed ParserTest Log!");
    response.send(await crawl.rssCrawl());
  }
);

export const testRssParsing = functions.https.onRequest(
  async (request, response) => {
    response.send(await crawl.testRssParsing(request.params.url));
  }
);

export const createKeyword = functions.https.onRequest(
  async (request, response) => {
    functions.logger.info(request.query.keyword);
    if (request.query.keyword == null) {
      response.send({
        msg: "This Functions requires Keyword",
        example:
          "https://us-central1-meerkat-smtp.cloudfunctions.net/createKeyword?keyword=주식",
      });
    } else {
      response.send(
        await foogle.createKeyword(request.query.keyword.toString())
      );
    }
  }
);
