import { atom } from 'recoil'

export const stocksState = atom({
    key: 'stocks',
    default: {}
})

export const selectedArticleState = atom({
    key: 'articleSelected',
    default: '',
})
  