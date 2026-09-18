import { Router, Request, Response } from "express";
import { BookType, BookCreateType } from "../types/BookType.js";
import { BookResponseType } from "../types/bookResType.js";
import { books } from "../data/books.js";
import { compareBook } from "../utilis/showBooks.js";
import { pool } from "../db/database.js";

const router = Router()

// GET /books: книги из PostgreSQL для страницы каталога.
router.get("/", async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM public.books ORDER BY id");
        res.render("pages/book", {
            books: result.rows,
            title: "Книги"
        });
    } catch (error) {
        next(error);
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