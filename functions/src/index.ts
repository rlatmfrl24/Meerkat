import * as functions from "firebase-functions";
import * as crawl from "./rss/crawl";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const feedParserTest = functions.https.onRequest(
  async (request, response) => {
    functions.logger.info("[Test]::Feed ParserTest Log!");
    await crawl.feedParserTest();
    response.send("RSS Feed Parsed. Check console log..");
  }
);
