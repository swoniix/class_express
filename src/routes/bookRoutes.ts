import { Router, Request, Response } from "express";
import { BookType, BookCreateType } from "../types/BookType.js";
import { BookResponseType } from "../types/bookResType.js";
import { books } from "../data/books.js";
import { compareBook } from "../utilis/showBooks.js";
import { pool } from "../db/db_connection.js";
import multer from "multer"
import path from "node:path";

const router = Router()



//add Books
router.get(
    "/add-book",
    (
        req: Request,
        res: Response,
    ) => {
        res.render("pages/bookForm", { title: "Add Book" })
    }
)

router.post(
    "/add-book",
    upload.single("image"),
    (
        req: Request<{}, BookCreateType>,
        res: Response,
    ) => {
        const { title, price, year } = req.body
        const is_active = req.body.is_active ? true : false
        const book: BookType = {
            id: 10000,
            title,
            price,
            is_active,
            image: req.image
        }
        console.log(req.body)
        res.end()
    }
)

// GET /books: книги из PostgreSQL для страницы каталога.
router.get("/",
    async (req: Request<{}, BookResponseType, null, { title: string }>,
        res: Response) => {
        try {
            // const data = await fetch(`${process.env.PATH_TO_JSON_SERVER}/book`)
            // const json = await data.json()
            // console.log(json)
            // res.render("pages/books", { book: json, title: "Books" })

            const result = await pool.query("SELECT * FROM public.books ORDER BY id");
            res.render("pages/book", {
                books: result.rows,
                title: "Книги"
            });
        } catch (error) {
            console.log(error)
        }
    });

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
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const data = await pool.query(
        "SELECT * FROM books WHERE id = $1",
        [id]
    );
    const book = data.rows[0];
    if (!book) {
        res.status(404).send("Книга не найдена");
        return;
    }
    res.render("pages/book-detail", {
        title: book.title,
        book
    });
});
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