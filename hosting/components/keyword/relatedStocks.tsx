import { useRecoilState, useRecoilValue } from "recoil";
import { Button, Header, Table } from "semantic-ui-react";
import {
  selectedKeywordState,
  selectedKeywordWithStockState,
} from "../../lib/store";
import RelatedStockTableItem from "./stockTableItem"


export default function RelatedStocks() {
  const [selectedKeyword, selectKeyword] = useRecoilState(selectedKeywordState);
  const keywordWithStock = useRecoilValue(selectedKeywordWithStockState);

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
              selectKeyword("");
              setKeywordList(
                keywords.filter((item) => {
                  return item.id != selectedKeyword;
                })
              );
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
              return RelatedStockTableItem(stock, idx);
            })
          ) : (
            <></>
          )}
        </Table.Body>
      </Table>
    </>
  );
}
