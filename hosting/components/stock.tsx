import { useState } from 'react'
import { stocksState } from "../lib/store";
import { Item, Label, Grid, Button, Segment, Accordion, List, Icon, SemanticCOLORS } from 'semantic-ui-react'
import { loadStocksByKeywords } from '../lib/firebase'
import { useRecoilValue } from 'recoil'


function StockData(data) {
    let color = '' as SemanticCOLORS
    switch (data.influenceFactor) {
      case "강한긍정":
        color = "red"  
        break;
      case "긍정":
        color = "orange"
        break;
      case "약한긍정":
        color = "yellow"
        break;
      case "중립":
        color = "green"
        break;
      case "약한부정":
        color = "teal"
        break;
      case "부정":
        color = "blue"
        break;
      case "강한부정":
        color = "violet"
        break;
      default:
        break;
    }
  
    return (
      <List.Item key={data.stockId}>
        <List.Content style={{display:'flex', alignItems:'center', justifyContent: 'space-between'}}>
          <List.Header>{data.stockName}</List.Header>
          <Label style={{width:'5rem', textAlign:'center'}} color={color}>{data.influenceFactor}</Label>
        </List.Content>
      </List.Item>
    )
}
  
export function Stocks() {
    const [activeKeywordIndex, setActiveKeywordIndex] = useState(0)
    const stocks = useRecoilValue(stocksState)
  
    return (
      <Segment style={{height:'50em', overflow: 'auto'}}>
        <Accordion>
          {Object.keys(stocks).map((key, idx)=> {
            return (
              <div key={idx}>
                <Accordion.Title 
                  active={activeKeywordIndex === idx}
                  index={idx}>
                {key}
                </Accordion.Title>
                <Accordion.Content active>
                  <List>
                    {stocks[key].map((item, idx)=> {
                      return StockData(item)
                    })}
                  </List>
                </Accordion.Content>
              </div>
            )
          })}
        </Accordion>
    </Segment>
    )
}
  