import Parser from "rss-parser";
import * as admin from "firebase-admin";
import * as axios from "axios";
import * as iconv from "iconv-lite";

type CustomFeed = { title: string };
type CustomItem = { title: string; link: string };
type Feed = {
  title: string;
  link: string;
  origin: string;
  rssRef: FirebaseFirestore.DocumentReference;
  timestamp: FirebaseFirestore.FieldValue;
  keywordRef: Array<FirebaseFirestore.DocumentReference>;
};

type RSSItem = {
  rssId: string;
  rssName: string;
  rssLink: string;
  encoding: string;
};

const FieldValue = admin.firestore.FieldValue;
const parser: Parser<CustomFeed, CustomItem> = new Parser({
  customFields: {
    feed: ["title"],
    item: ["title", "link"],
  },
});

export const rssCrawl = async (): Promise<Array<Feed>> => {
  const db = admin.firestore();
  const rssList: Array<RSSItem> = [];
  const newItemList = [];
  await db
    .collection("rss")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        rssList.push({
          rssId: doc.id,
          rssName: doc.data().name,
          rssLink: doc.data().link,
          encoding: doc.data().encoding,
        });
      });
    });
  
  const keywordList = (await db.collection("keyword").get()).docs.map(
    (doc) => doc.id
  );

  for (const rss of rssList) {
    const feeds = await getFeeds(rss);
    console.log("[" + rss.rssName + "]::->" + feeds);
    const feedLinkHistory: string[] = (
      await db
        .collection("item")
        .where("origin", "==", rss.rssId)
        .orderBy("timestamp", "desc")
        .limit(10)
        .get()
    ).docs.map((item) => {
      return item.data().link;
    });
    for (const feed of feeds) {
      if (!feedLinkHistory.includes(feed.link)) {
        const feedKeywordRefs: Array<FirebaseFirestore.DocumentReference> = [];
        keywordList.map((keyword) => {
          if (feed.title.includes(keyword)) {
            feedKeywordRefs.push(db.collection("keyword").doc(keyword));
          }
        });
        feed.keywordRef = feedKeywordRefs;

        await db.collection("item").add(feed);
        newItemList.push(feed);
      }
    }
  }
  return newItemList;
};

export const testRssParsing = async (url: string) => {
  const feed = await parser.parseURL(url);
  return feed.items;
};

const getFeeds = async (rss: RSSItem): Promise<Array<Feed>> => {
  // const rawFeedString = (await axios.default.get(rss.rssLink)).data;
  const rawBuffer = (
    await axios.default({
      url: rss.rssLink,
      method: "GET",
      responseType: "arraybuffer",
    })
  ).data;

  const feedString = iconv.decode(rawBuffer, rss.encoding);

  const feed = await parser.parseString(feedString);

  return feed.items.map((item) => {
    return {
      title: item.title,
      link: item.link,
      origin: rss.rssId,
      rssRef: admin.firestore().collection("rss").doc(rss.rssId),
      timestamp: FieldValue.serverTimestamp(),
      keywordRef: [],
    };
  });
};
