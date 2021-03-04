import {
  Label,
  Icon,
  Button,
  Header,
  Table,
} from "semantic-ui-react";
import { getColorByInfluenceFactor } from "../../lib/utils"

export default function RelatedStockTableItem(stock, idx) {
    let color = getColorByInfluenceFactor(stock.influenceFactor);
  
    return (
      <Table.Row key={idx}>
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
  
  