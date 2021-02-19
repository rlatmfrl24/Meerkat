import * as functions from "firebase-functions";
import * as axios from "axios";
import * as cheerio from "cheerio";

const foogleEndPoint = "http://58.229.6.72/search";
// const testLink =
//   "http://58.229.6.72/search?keyword=%EC%A0%84%EA%B8%B0%EC%B0%A8&t0=20200220&t1=20210220";

export const testFoogle = async (keyword: string) => {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setMonth(toDate.getMonth() - 12);
  functions.logger.info("[From Date]::->" + dateToStringFormat(fromDate));
  functions.logger.info("[To Date]::->" + dateToStringFormat(toDate));
  functions.logger.info("[keyword Code]::->" + encodeURI(keyword));

  const foogleResponse = await axios.default(foogleEndPoint, {
    method: "GET",
    url: foogleEndPoint,
    params: {
      keyword: encodeURI(keyword),
      t0: dateToStringFormat(fromDate),
      t1: dateToStringFormat(toDate),
    },
  });

  // const foogleResponse = await axios.default.get(testLink);
  const $ = cheerio.load(foogleResponse);
  $("#stock_list > tbody")
    .find("tr")
    .each((index, element) => {
      functions.logger.info(element);
    });
};

const dateToStringFormat = (date: Date): string => {
  return date.toISOString().split("T")[0].replace(/-/gi, "");
};
