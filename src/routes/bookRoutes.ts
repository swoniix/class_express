import { Router, Request, Response } from "express";
import { BookType , BookCreateType } from "../types/BookType.js";
import { getBooksByTitle } from "../utilis/showBooks.js";
import { BookResponseType } from "../types/bookResType.js";
import { books } from "../data/books.js";
import { compareBook } from "../utilis/showBooks.js";
import { pool } from "../db/database.js";

// interface BookCreateType {
//   title: string;
//   price: number;
//   is_active: boolean;
// }

const router = Router()

//GET /books
router.get(
  "/", 
  async(
    req: Request<{}, BookResponseType, null, { title: string }>,
    res: Response) => {
    //  const result = await pool.query("SELECT * FROM books");
    //    res.json(result.rows)
  //отримання сіх книжок або пошук по тайтлу

   const exist_book: boolean = books.length > 0
   const title = String(req.query.title)
   let our_books: BookType[] | null = null;
   if (title !== undefined) {
     our_books = getBooksByTitle(title, books)
   }
   res.render("pages/book", {books})
  // const response: BookResponseType = {
  //   data: exist_book ? (our_books !== null ? our_books : books) : null,
  //   error: exist_book ? null : "Books list is empty",
  //   status: exist_book ? 200 : 404
  // };
  // res.writeHead(response.status, {
  //   "Content-Type": "application/json"
  // })
  // res.end(JSON.stringify(response))
})
router.post('/books', (req: Request<{}, BookResponseType, BookCreateType>, res) => {
  const body = req.body
  const response: BookResponseType = {
    data: null,
    error: null,
    status: 500
  }
  if (body !== undefined) {
    const id: number = books.length > 0 ? books.sort(compareBook)[0].id + 1 : 1
    const book: BookType = {
      id,
      title: body.title,
      price: body.price,
      is_active: body.is_active
    }
    books.push(book)
    response.data = book
    response.status = 201
  }

  res.status(response.status).json(response)
})
router.get("/:id",  (req:Request<{title:string, id:number}>,res)=>{
    const id:number = +req.params.id
    const book:BookType|undefined = books.find((book)=>book.id===id);
    const exist_book:boolean = (book!==undefined)
    const response:BookResponseType = {
        data:exist_book?book as BookType:null,
        error:exist_book?null:"The book not found",
        status:exist_book?200:404
    };
    res.status(response.status).json(response)
})
router.delete("/:id", (req: Request<{ id: string }>, res) => {
    const id: number = +req.params.id
    const index: number = books.findIndex((book) => book.id === id)
    const response: BookResponseType = {
        data: null,
        error: null,
        status: 404
    }
    if (index !== -1) {
        const deletedBook = books.splice(index, 1)
        response.data = deletedBook[0]
        response.status = 200
    } else {
        response.error = "The book not found"
    }
    res.status(response.status).json(response)
})
router.put("/:id", (req: Request<{ id: string }, BookResponseType, BookCreateType>, res) => {
    const id: number = +req.params.id
    const index: number = books.findIndex((book) => book.id === id)
    const body = req.body
    const response: BookResponseType = {
        data: null,
        error: null,
        status: 404
    }
    if (index !== -1) {
        const book: BookType = {
            id: id,
            title: body.title,
            price: body.price,
            is_active: body.is_active
        }
        books[index] = book
        response.data = book
        response.status = 200
    } else {
        response.error = "The book not found"
    }
    res.status(response.status).json(response)
})

export default router