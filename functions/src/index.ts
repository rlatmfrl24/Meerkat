import * as functions from "firebase-functions";
import * as crawl from "./rss/crawl";
import * as foogle from "./rss/foogle";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

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

export const testFoogleFunctions = functions.https.onRequest(
  async (request, response) => {
    await foogle.testFoogle("전기차");
    response.send("check log");
  }
);