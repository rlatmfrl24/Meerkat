import Head from "next/head";
import { useState } from "react";
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
  Dimmer,
  Loader
} from "semantic-ui-react";
import { useRecoilState, useRecoilValue } from 'recoil'
import { articleListState, keywordListState, loaderState } from '../lib/store'
import { getArticleList, getKeywordList } from "../lib/firebase";
import NewsWithStock from "../components/home/home";
import KeywordManger from "../components/keyword/keyword"
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsfMGnQkCiNyxnTs8_6O3bfcDAdhnflus",
  authDomain: "meerkat-smtp.firebaseapp.com",
  projectId: "meerkat-smtp",
  storageBucket: "meerkat-smtp.appspot.com",
  messagingSenderId: "735494896618",
  appId: "1:735494896618:web:e34740ac80362633b11093",
  measurementId: "G-SY3SZ9H6L8",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


export default function Home({articles, keywords}) {
  const isLoading = useRecoilValue(loaderState)
  const [keywordList, setKeywordList] = useRecoilState(keywordListState)
  if (keywordList.length == 0) {
    setKeywordList(keywords)
  }

  const panes = [
    { menuItem: "Home", render: () => <NewsWithStock itemList={articles}/> },
    { menuItem: "Keyword", render: ()=> <KeywordManger  keywords={keywords}/> }
  ];

  return (
    <div>
      <Head>
        <title>Meerkat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item as="a">
            <span style={{ fontSize: "2em" }}>Meerkat</span>
          </Menu.Item>
        </Container>
      </Menu>
      <Container style={{ marginTop: "6em", marginBottom: "3em" }}>
        <Dimmer active={isLoading}>
          <Loader>Loading</Loader>
        </Dimmer>
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </Container>
    </div>
  );
}

// export const getStaticProps: GetStaticProps = async (context) => {
//   const articles = await getArticleList();
//   const keywords = await getKeywordList();

//   return {
//     props: {
//       articles,
//       keywords
//     },
//   };
// };

export const getServerSideProps: GetServerSideProps = async (context) => {
  const articles = await getArticleList();
  const keywords = await getKeywordList();

  return {
    props: {
      articles,
      keywords
    },
  };
};
