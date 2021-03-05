import * as functions from "firebase-functions";
import * as cheerio from "cheerio";
import * as admin from "firebase-admin"
import * as axios from "axios"

const dataExtractor = /'(.+?)'/g
const foogleEndPoint = "http://58.229.6.72/search";
const FieldValue = admin.firestore.FieldValue;

type Stock = {
  stockId: string|null;
  stockName: string|null;
  newCount: number;
  influenceFactor: string|null;
}

export const createKeyword = async (keyword: string) => {
  const db = admin.firestore()
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setMonth(toDate.getMonth() - 12);
  functions.logger.info("[From Date]::->" + dateToStringFormat(fromDate));
  functions.logger.info("[To Date]::->" + dateToStringFormat(toDate));
  functions.logger.info("[keyword Code]::->" + encodeURI(keyword));

  const foogleResponse = await axios.default.get(foogleEndPoint, {
    method: "GET",
    params: {
      keyword: (keyword),
      t0: dateToStringFormat(fromDate),
      t1: dateToStringFormat(toDate),
    },
    responseType: "text",
  });
  
  const stockList: Array<Stock> = []
  const $ = cheerio.load(foogleResponse.data);
  $("#stock_list > tbody")
    .find("tr")
    .each((index, element)=>{
      const stockBasic = $(element).find("td.itemabbrnm > a:nth-child(2)")?.attr("onclick")?.match(dataExtractor)?.map(data => data.replace(/'/g, ""))
      const stockId = stockBasic ? stockBasic[0] : null
      const stockName = stockBasic ? stockBasic[1] : null
      const articleCount = $(element).find("td:nth-child(2)").html()
      const influenceFactor = $(element).find(".badge").html()
      stockList.push({
          stockId: stockId,
          stockName: stockName,
          newCount: Number(articleCount),
          influenceFactor: influenceFactor
        })
    })
  await db.collection("keyword").doc(keyword).set({
    createdAt: FieldValue.serverTimestamp(),
    relatedStock: stockList
  })
  return stockList
};

const dateToStringFormat = (date: Date): string => {
  return date.toISOString().split("T")[0].replace(/-/gi, "");
};


export const deleteStockFromKeyword = async (
  keyword: string,
  stockName: string
) => {


  const db = admin.firestore();
  const keywordRef = db.collection("keyword").doc(keyword);
  const keywordData = await keywordRef.get();
  const stockData = keywordData.data()?.relatedStock;
  const newStockData = stockData.filter(
    (item: Stock) => item.stockName != stockName
  );
  return await keywordRef.update({
    relatedStock: newStockData,
  });
};

export const addStockToKeyword = async (keyword: string, stockData: Stock) => {
  const db = admin.firestore();
  const keywordRef = db.collection("keywords").doc(keyword)
  const keywordData = await keywordRef.get();
  const newStockData = [
    stockData,
    ...keywordData.data()?.relatedStock
  ]
  return await keywordRef.update({
    relatedStock: newStockData
  })
}