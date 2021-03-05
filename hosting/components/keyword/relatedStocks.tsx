import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Button, Header, Table } from "semantic-ui-react";
import {
  keywordListState,
  selectedKeywordState,
  selectedKeywordWithStockState,
  loaderState
} from "../../lib/store";
import RelatedStockTableItem from "./stockTableItem"
import { removeKeyword } from "../../lib/firebase"

export default function RelatedStocks() {
  const [selectedKeyword, selectKeyword] = useRecoilState(selectedKeywordState);
  const keywordWithStock = useRecoilValue(selectedKeywordWithStockState);
  const setIsLoading = useSetRecoilState(loaderState)
  const [keywordList, setKeywordList] = useRecoilState(keywordListState)

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          <Header as="h2">{selectedKeyword}</Header>
        </span>
        <span>
          <Button secondary>Add Stock</Button>
          <Button
            color="red"
            onClick={async () => {
              setIsLoading(true);
              await removeKeyword(selectedKeyword);
              setKeywordList(
                keywordList.filter((item) => {
                  return item.id != selectedKeyword;
                })
              );
              selectKeyword("")
              setIsLoading(false);
            }}
          >
            Remove Keyword
          </Button>
        </span>
      </div>
      <Table fixed>
        <Table.Body>
          {keywordWithStock.relatedStock != undefined ? (
            keywordWithStock.relatedStock.map((stock, idx) => {
              return <RelatedStockTableItem keyword={keywordWithStock.id} stock={stock} idx={idx} />
              // return RelatedStockTableItem(keywordWithStock.id, stock, idx);
            })
          ) : (
            <></>
          )}
        </Table.Body>
      </Table>
    </>
  );
}
