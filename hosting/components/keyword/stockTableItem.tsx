import {
  Label,
  Icon,
  Button,
  Header,
  Table,
} from "semantic-ui-react";
import { useRecoilState, useSetRecoilState } from 'recoil'
import { getColorByInfluenceFactor } from "../../lib/utils"
import { removeRelatedStock, getKeywordList } from "../../lib/firebase"
import { keywordListState, loaderState } from "../../lib/store"

export default function RelatedStockTableItem(props) {
    const setIsLoading = useSetRecoilState(loaderState)
    const [keywordList, setKeywordList] = useRecoilState(keywordListState)
    let color = getColorByInfluenceFactor(props.stock.influenceFactor);
  
    return (
      <Table.Row key={props.idx}>
        <Table.Cell>
          <Header as="h4">{props.stock.stockName}</Header>
        </Table.Cell>
        <Table.Cell>{props.stock.stockId}</Table.Cell>
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
              {props.stock.influenceFactor}
            </Label>
            <Icon name="close" size="large" style={{ cursor: "pointer" }} onClick={async ()=>{
              setIsLoading(true)
              await removeRelatedStock(props.keyword, props.stock.stockName)
              setKeywordList(await getKeywordList())
              setIsLoading(false)
            }} />
          </span>
        </Table.Cell>
      </Table.Row>
    );
  }
  
  