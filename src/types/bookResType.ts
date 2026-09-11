import { BookType } from "./BookType.js"

export type BookResType = {
  data: null | BookType | BookType[],
  error: null | string
}