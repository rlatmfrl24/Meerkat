import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  Tab,
  Grid,
  List,
  Icon,
  Button,
  Header,
  Modal,
  Input,
} from "semantic-ui-react";
import {
  keywordListState,
  selectedKeywordState,
  selectedKeywordWithStockState,
  loaderState
} from "../../lib/store";
import { removeKeyword, addKeyword } from "../../lib/firebase";
import RelatedStocks from "./relatedStocks"

export default function KeywordManger({ keywords }) {
  const [keywordList, setKeywordList] = useRecoilState(keywordListState);
  const [selectedKeyword, selectKeyword] = useRecoilState(selectedKeywordState);
  const setIsLoading = useSetRecoilState(loaderState)

  const [open, setOpen] = useState(false);
  const [createKeyword, setCreateKeyword] = useState("");

  return (
    <Tab.Pane attched="false" as="div">
      <Grid column={2} divided>
        <Grid.Row>
          <Grid.Column width={3}>
            <List selection>
              {keywordList.map((keywordData, idx) => {
                return (
                  <List.Item
                    key={idx}
                    active={selectedKeyword == keywordData.id}
                    onClick={() => selectKeyword(keywordData.id)}
                  >
                    <List.Content>
                      <List.Header>{keywordData.id}</List.Header>
                    </List.Content>
                  </List.Item>
                );
              })}
              <Modal
                size="mini"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
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
                    <Input
                      fluid
                      placeholder="Keyword.."
                      onChange={(event, data) => setCreateKeyword(data.value)}
                    />
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                  <Button color="black" onClick={() => setOpen(false)}>
                    Nope
                  </Button>
                  <Button
                    content="Create"
                    labelPosition="right"
                    icon="checkmark"
                    onClick={async () => {
                      setOpen(false);
                      setIsLoading(true);
                      const result = await addKeyword(createKeyword);
                      selectKeyword(createKeyword);
                      setKeywordList([result, ...keywordList]);
                      setIsLoading(false);
                    }}
                    positive
                  />
                </Modal.Actions>
              </Modal>
            </List>
          </Grid.Column>
          <Grid.Column width={13}>
            {selectedKeyword == "" ? <></> : <RelatedStocks />}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Tab.Pane>
  );
}
