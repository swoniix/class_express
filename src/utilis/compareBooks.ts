import { BookType } from "../types/BookType.js";

type compareBooks = (b1:BookType, b2:BookType) => number

export const compareBooks:compareBooks = (b1,b2)=>{
    return b2.id - b1.id
}