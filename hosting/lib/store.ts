import { atom, selector } from "recoil";
import { getArticleList } from "./firebase"

export const loaderState = atom({
  key: "isLoading",
  default: false
})

export const stocksState = atom({
  key: "stocks",
  default: {},
});

export const selectedArticleState = atom({
  key: "articleSelected",
  default: "",
});

export const keywordListState = atom({
  key: "keywordList",
  default: [],
});

export const selectedKeywordState = atom({
  key: "selectedKeyword",
  default: "",
});

export const selectedKeywordWithStockState = selector({
  key: "selectedKeywordWithStock",
  get: ({ get }) => {
    const list = get(keywordListState);
    const keyword = get(selectedKeywordState);

    if (list.map((item) => item.id).includes(keyword)) {
      return list.filter((item) => item.id == keyword)[0];
    } else {
      return {
        id: "",
        relatedStock: [],
      };
    }
  },
});
