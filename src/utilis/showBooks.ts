import { BookType } from "../types/BookType.js";

type showBookType = (book: BookType) => string;
type showBooksType = (books: Array<BookType>) => string;

// 1. Додано | та другий параметр books у тип
type getBooksByTitleType = (title: string, books: BookType[]) => BookType[] | null;


const showBook: showBookType = (book) => {
  return `<div class="book-card">
<h2 class="book-title">${book.title}</h2>

  <p class="book-price">${book.price} грн</p>

  <span class="book-status active">${book.isActive ? "В наявності" : "Немає"}</span>

  <a href="/book?id=${book.id}" class="book-button">Купити</a>
</div>`
}

const showAllBooks: showBooksType = (books) => {
  let books_content: string = ""
  
  // 2. Виправлено аргументи forEach та HTML-тег <body>
  books.forEach((book, index) => {
    if (index === 0) {
      books_content += `<html><head><link rel="stylesheet" href="book.css"></head><body><div class="books-list">`
    }
    books_content += showBook(book)
  });

  books_content += `</div></body></html>`
  return books_content
}

const getBooksByTitle:getBooksByTitleType = (title, books)=>{
    const books_filtred = books.filter(book=>title.toLowerCase().trim()===book.title.toLocaleLowerCase().trim())
    if(books_filtred.length>0)
    {
        return books_filtred
    }
    return null
}