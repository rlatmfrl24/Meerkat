import Parser from "rss-parser";

type CustomFeed = { title: string };
type CustomItem = { title: string; link: string };

const parser: Parser<CustomFeed, CustomItem> = new Parser({
  customFields: {
    feed: ["title"],
    item: ["title", "link"],
  },
});

export const feedParserTest = async () => {
  const feed = await parser.parseURL(
    "https://www.yonhapnewstv.co.kr/category/news/economy/feed/"
  );
  console.log(feed.title);

  feed.items.forEach((item) => {
    console.log(item.title + ":" + item.link);
  });
};
