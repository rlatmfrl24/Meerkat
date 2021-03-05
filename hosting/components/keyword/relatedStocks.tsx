import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  Button,
  Header,
  Table,
  Modal,
  Input,
  Select,
  Form,
  Message,
  Container,
  Segment,
  Icon
} from "semantic-ui-react";
import {
  keywordListState,
  selectedKeywordState,
  selectedKeywordWithStockState,
  loaderState,
} from "../../lib/store";
import RelatedStockTableItem from "./stockTableItem";
import {
  removeKeyword,
  addRelatedStock,
  getKeywordList,
} from "../../lib/firebase";

export default function RelatedStocks() {
  const keywordWithStock = useRecoilValue(selectedKeywordWithStockState);
  const setIsLoading = useSetRecoilState(loaderState);
  const [selectedKeyword, selectKeyword] = useRecoilState(selectedKeywordState);
  const [keywordList, setKeywordList] = useRecoilState(keywordListState);
  const [showAddStockModel, setShowAddStockModal] = useState(false);
  const [newStockName, setNewStockName] = useState("");
  const [newStockID, setNewStockID] = useState("");
  const [newStockInfluenceFactor, setNewStockInfluenceFactor] = useState("");
  const [isAddStockFormError, setIsAddStockFormError] = useState(false);

  const influenceFactorOptions = [
    { key: "vp", value: "강한긍정", text: "강한긍정" },
    { key: "p", value: "긍정", text: "긍정" },
    { key: "wp", value: "약한긍정", text: "약한긍정" },
    { key: "neu", value: "중립", text: "중립" },
    { key: "wn", value: "약한부정", text: "약한부정" },
    { key: "n", value: "부정", text: "부정" },
    { key: "vn", value: "강한부정", text: "강한부정" },
  ];

  return (
    <>
      {selectedKeyword == "" ? (
        <Container >
          <Segment placeholder >
            <Header icon>
              <Icon name="hand point left outline"/>
              Please Select Keyword on List
            </Header>
          </Segment>
        </Container>
      ) : (
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
              <Modal
                size="mini"
                onClose={() => setShowAddStockModal(false)}
                onOpen={() => setShowAddStockModal(true)}
                open={showAddStockModel}
                trigger={
                  <Button secondary disabled={selectedKeyword == ""}>
                    Add Stock
                  </Button>
                }
              >
                <Modal.Header>Add Stock</Modal.Header>
                <Modal.Content>
                  <Modal.Description>
                    <Form error={isAddStockFormError}>
                      <Form.Field>
                        <label>Stock Name</label>
                        <Form.Input
                          fluid
                          placeholder="Stock Name"
                          onChange={(event, data) =>
                            setNewStockName(data.value)
                          }
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Stock ID</label>
                        <Form.Input
                          fluid
                          placeholder="Stock ID"
                          onChange={(event, data) => setNewStockID(data.value)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Influence Factor</label>
                        <Form.Select
                          style={{ marginTop: "1rem" }}
                          fluid
                          placeholder="Select Influence Factor"
                          options={influenceFactorOptions}
                          onChange={(event, data) => {
                            setNewStockInfluenceFactor(data.value);
                          }}
                        />
                      </Form.Field>
                      <Message
                        error
                        header="Action Forbidden"
                        content="You should fill All Field."
                      />
                    </Form>
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    color="black"
                    onClick={() => setShowAddStockModal(false)}
                  >
                    Nope
                  </Button>
                  <Button
                    content="Add"
                    labelPosition="right"
                    icon="checkmark"
                    positive
                    onClick={async () => {
                      const newStockData = {
                        stockId: newStockID,
                        stockName: newStockName,
                        newCount: 0,
                        influenceFactor: newStockInfluenceFactor,
                      };
                      if (
                        newStockID == "" ||
                        newStockName == "" ||
                        newStockInfluenceFactor == ""
                      ) {
                        setIsAddStockFormError(true);
                      } else {
                        setIsAddStockFormError(false);
                        setShowAddStockModal(false);
                        setIsLoading(true);
                        await addRelatedStock(selectedKeyword, newStockData);
                        setKeywordList(await getKeywordList());
                        setNewStockID("");
                        setNewStockName("");
                        setNewStockInfluenceFactor("");
                        setIsLoading(false);
                      }
                    }}
                  />
                </Modal.Actions>
              </Modal>
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
                  selectKeyword("");
                  setIsLoading(false);
                }}
              >
                Remove Keyword
              </Button>
            </span>
          </div>
          <Table fixed>
            <Table.Body>
              {keywordWithStock.relatedStock.map((stock, idx) => {
                return (
                  <RelatedStockTableItem
                    key={idx}
                    keyword={keywordWithStock.id}
                    stock={stock}
                  />
                );
              })}
            </Table.Body>
          </Table>
        </>
      )}
    </>
  );
}
