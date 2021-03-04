import { useRecoilState, useRecoilValue } from "recoil";
import { stocksState, selectedArticleState } from "../../lib/store";
import { getArticleList } from "../../lib/firebase";
import {
  Container,
  Header,
  Grid,
  Segment,
  Accordion,
  Icon,
  Item,
  Menu,
  Tab,
} from "semantic-ui-react";
import { ArticleList } from "./article";
import { Stocks } from "./stock";

export default function NewsWithStock({ itemList }) {
  const [selectedArticle, articleSelect] = useRecoilState(selectedArticleState);
  const stocksData = useRecoilValue(stocksState);

  return (
    <Tab.Pane attched="false" as="div">
      <Grid column={2} >
        <Grid.Row>
          <Grid.Column width={12} style={{marginTop:"1rem"}}>
            {ArticleList(itemList)}
          </Grid.Column>
          <Grid.Column width={4}>
            <Header as="h2">Related Stocks</Header>
            {selectedArticle === "" || Object.keys(stocksData).length === 0 ? (
              <Segment placeholder>
                <Header icon>Please Select Tagged News</Header>
              </Segment>
            ) : (
              <Stocks />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Tab.Pane>
  );
}
