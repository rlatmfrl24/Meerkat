import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

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

export async function getKeywordList() {
    const db = firebase.firestore()
    const keywordList = []
    const keywordsSnapshot = await db.collection('keyword').get()
    for (const keywordRef of keywordsSnapshot.docs) {
        
        const keywordData = {
            id: keywordRef.id,
            relatedStock: keywordRef.data().relatedStock
        }
        keywordList.push(keywordData)
    }
    return keywordList
}

export async function removeKeyword(id){
    const db = firebase.firestore()
    return await db.collection('keyword').doc(id).delete()
}

export async function addKeyword(id){
    const addFunction = firebase.functions().httpsCallable('addKeyword')
    const result = await addFunction({keyword:id})
    return {
        id: id,
        relatedStock: result.data
    }
}

export async function addRelatedStock(){

}

export async function removeRelatedStock(keyword, stock){
    const removeStockFunction = firebase.functions().httpsCallable('deleteStockFromKeyword')
    const targetStock = {
        keyword: keyword,
        stockName: stock
    }
    const result = await removeStockFunction(targetStock)
    console.log(result)
    return targetStock
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