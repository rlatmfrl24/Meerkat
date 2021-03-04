import { useState } from 'react'
import { Item, Label, Grid, Button, Segment, Accordion, List, Icon } from 'semantic-ui-react'
import { selectedArticleState, stocksState } from "../../lib/store";
import { getArticleList, loadStocksByKeywords } from '../../lib/firebase'
import { useRecoilState, useSetRecoilState } from 'recoil'

function Article(article) {
  const selectArticle = useSetRecoilState(selectedArticleState)
  const setStocks = useSetRecoilState(stocksState)

  return (
    <Item key={article.id} onClick={async ()=>{
      const data = await loadStocksByKeywords(article.keywords);
      setStocks(data)
      selectArticle(article)
    }}>
      <Item.Content>
        <Item.Header as='h4'>{article.title}</Item.Header>
        <Item.Meta>
          <span className="origin">{article.origin}</span>
        </Item.Meta>
        <Item.Extra>
          {article.keywords.map((item, idx) => {
            return <Label key={idx}>{item}</Label>
          })}
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

export function ArticleList(itemList) {
    return (
        <Item.Group divided>
          {itemList.map(item => {
            return Article(item)
          })}
      </Item.Group>
    )
}