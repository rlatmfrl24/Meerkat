import Head from 'next/head'
import { GetStaticProps } from 'next'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Container, Header, Grid, Segment, Accordion, Icon, List, Label, Item } from 'semantic-ui-react'
import { stocksState, selectedArticleState } from '../lib/store'
import { getArticleList } from '../lib/firebase'
import { ArticleList } from '../components/article'
import { Stocks } from '../components/stock'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAsfMGnQkCiNyxnTs8_6O3bfcDAdhnflus",
  authDomain: "meerkat-smtp.firebaseapp.com",
  projectId: "meerkat-smtp",
  storageBucket: "meerkat-smtp.appspot.com",
  messagingSenderId: "735494896618",
  appId: "1:735494896618:web:e34740ac80362633b11093",
  measurementId: "G-SY3SZ9H6L8"
};

if(!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
  // firebase.analytics()
}

export default function Home({itemList}) {
  const [selectedArticle, articleSelect] = useRecoilState(selectedArticleState)
  const stocksData = useRecoilValue(stocksState)

  return (
    <div>
      <Head>
        <title>Meerkat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container style={{marginTop:'3em', marginBottom:'3em'}}>
        <Header as='h1'>Meerkat</Header>
        <Grid column={2} style={{marginTop:'2rem'}}>
          <Grid.Row>
            <Grid.Column width={12}>
              <Header as='h3'>News Headers</Header>
              {ArticleList(itemList)}
            </Grid.Column>
            <Grid.Column width={4}>
              <Header as='h3'>Related Stocks</Header>
              {(selectedArticle === '' || (Object.keys(stocksData).length === 0)) ? 
                <Segment placeholder>
                  <Header icon>Please Select Tagged News</Header>
                </Segment>
                :
                <Stocks />
              }

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  )
}

export const getStaticProps : GetStaticProps = async (context) => {
  const itemList = await getArticleList()
  return {
    props: {
      itemList
    }
  }
}