import { useState } from "react";
import {
  Tab,
  Grid,
  List,
  Label,
  Icon,
  Button,
  Header,
  Container,
  Table,
  Modal,
  Input,
} from "semantic-ui-react";
import { removeKeyword, addKeyword } from "../lib/firebase";
import { keywordListState } from "../lib/store";
import { useRecoilState } from "recoil";

export default function KeywordManger({ keywords }) {
  const [keywordList, setKeywordList] = useRecoilState(keywordListState);
  const [selectedKeyword, selectKeyword] = useState({
    id: "",
    relatedStock: [],
  });
  const [open, setOpen] = useState(false);

  return (
    <Tab.Pane attched="false" as="Container">
      <Grid column={2} divided>
        <Grid.Row>
          <Grid.Column width={3}>
            <List selection>
              {keywordList.map((keyword, idx) => {
                return (
                  <List.Item
                    key={idx}
                    active={selectedKeyword.id == keyword.id}
                    onClick={() => selectKeyword(keyword)}
                  >
                    <List.Content>
                      <List.Header>{keyword.id}</List.Header>
                    </List.Content>
                  </List.Item>
                );
              })}
              <AddKeywordDialog open={open} setOpen={setOpen}/>
              {/* {AddKeywordDialog(open, setOpen)} */}
            </List>
          </Grid.Column>
          <Grid.Column width={13}>
            {selectedKeyword.id == "" ? (
              <></>
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
                    <Header as="h2">{selectedKeyword.id}</Header>
                  </span>
                  <span>
                    <Button secondary>Add Stock</Button>
                    <Button
                      color="red"
                      onClick={() => {
                        setKeywordList(
                          keywords.filter((item) => {
                            return item.id != selectedKeyword.id;
                          })
                        );
                        selectKeyword({
                          id: "",
                          relatedStock: [],
                        });
                        removeKeyword(selectedKeyword.id);
                      }}
                    >
                      Remove Keyword
                    </Button>
                  </span>
                </div>
                <Table fixed>
                  <Table.Body>
                    {selectedKeyword.relatedStock.map((stock, idx) => {
                      return relatedStockTableItem(stock, idx);
                    })}
                  </Table.Body>
                </Table>
              </>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Tab.Pane>
  );
}

function relatedStockTableItem(stock, idx) {
  let color = "" as SemanticCOLORS;
  color = getColorByInfluenceFactor(stock.influenceFactor);

  return (
    <Table.Row>
      <Table.Cell>
        <Header as="h4">{stock.stockName}</Header>
      </Table.Cell>
      <Table.Cell>{stock.stockId}</Table.Cell>
      <Table.Cell textAlign="right">
        <span>
          <Label
            style={{
              width: "5rem",
              textAlign: "center",
              marginRight: "1em",
            }}
            color={color}
          >
            {stock.influenceFactor}
          </Label>
          <Icon name="close" size="large" style={{ cursor: "pointer" }} />
        </span>
      </Table.Cell>
    </Table.Row>
  );
}

function getColorByInfluenceFactor(factor) {
  let color = "" as SemanticCOLORS;
  switch (factor) {
    case "강한긍정":
      color = "red";
      break;
    case "긍정":
      color = "orange";
      break;
    case "약한긍정":
      color = "yellow";
      break;
    case "중립":
      color = "green";
      break;
    case "약한부정":
      color = "teal";
      break;
    case "부정":
      color = "blue";
      break;
    case "강한부정":
      color = "violet";
      break;
    default:
      break;
  }
  return color;
}

function AddKeywordDialog(props) {
    const [createKeyword, setCreateKeyword] = useState("")

  return (
    <Modal
    size="mini"
      onClose={() => props.setOpen(false)}
      onOpen={() => props.setOpen(true)}
      open={props.open}
      trigger={
        <List.Item>
          <List.Content>
            <List.Header>
              <Icon name="plus" />
              Add Keyword
            </List.Header>
          </List.Content>
        </List.Item>
      }
    >
      <Modal.Header>Add Keyword</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Please Insert Keyword (e.g. 비트코인)</Header>
          <Input fluid placeholder="Keyword.." onChange={(event, data)=>setCreateKeyword(data.value)} />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => props.setOpen(false)}>
          Nope
        </Button>
        <Button
          content="Create"
          labelPosition="right"
          icon="checkmark"
          onClick={() => {
              addKeyword(createKeyword)
              props.setOpen(false)
            }}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}
