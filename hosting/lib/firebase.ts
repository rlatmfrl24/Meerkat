import firebase from 'firebase/app'
import 'firebase/firestore'

export async function getArticleList() {
    const db = firebase.firestore()

    const itemList = []
    const itemSnapshot = await db.collection('item').orderBy('timestamp', 'desc').limit(20).get()
    for (const docRef of itemSnapshot.docs) {
        const docData = docRef.data()
        const rssDoc = await docData.rssRef.get()
        const keywordList = docData.keywordRef.map(ref => {
            return ref.path.replace('keyword/', '')
        })

        const item = {
            id: docRef.id,
            title: docData.title,
            origin: rssDoc.data().name,
            keywords: keywordList
        }
        itemList.push(item)
    }
    return itemList
}

export async function loadStocksByKeywords(keywords) {
    const db = firebase.firestore()
    const stocks = {}
    for (const keyword of keywords) {
        const keywordSnapshot = await db.collection('keyword').doc(keyword).get()
        stocks[keyword] = keywordSnapshot.data().relatedStock
    }
    return stocks
}