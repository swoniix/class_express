import express from "express"
import "dotenv/config"
import { BookType } from "./types/BookType.js"
import { BookResType } from "./types/bookResType.js"
import { getBookByTitle } from "./utilis/showBooks.js"

const cl = console.log
const PORT = process.env.PORT || 4200
const HOST = process.env.HOST || "http://localhost"

const app = express()

// Масиви даних
const books: BookType[] = [
    { id: 1, title: "book1", price: 250, isActive: true },
    { id: 2, title: "book2", price: 320, isActive: true },
    { id: 3, title: "book3", price: 400, isActive: true }
]
const deletedBooks: BookType[] = []

// Головна сторінка
app.get('/', (req, res) => {
    res.send("<h2>Сервер працює! Перейди на /books</h2>")
})

// Отримати всі книги
app.get('/books', (req, res) => {
    if (books.length === 0) {
        return res.status(404).json({
            data: null,
            error: "Books list is empty"
        })
    }
    
    res.status(200).json({
        data: books,
        error: null
    })
})

// Отримати видалені книги
app.get('/deleted-books', (req, res) => {
    res.json(deletedBooks)
})

// Отримати одну книгу за ID
app.get('/books/:id', (req, res) => {
    const id: number = +req.params.id
    const book: BookType | undefined = books.find((b) => b.id === id)

    if (!book) {
        return res.status(404).json({
            data: null,
            error: "The Book not found"
        })
    }

    res.status(200).json({
        data: book,
        error: null
    })
})

// Видалити книгу за ID
app.delete('/books/:id', (req, res) => {
    const id: number = +req.params.id
    const bookIndex: number = books.findIndex((book) => book.id === id)

    if (bookIndex === -1) {
        return res.status(404).json({
            data: null,
            error: "The Book not found or already deleted"
        })
    }

    const [deletedBook] = books.splice(bookIndex, 1)
    deletedBooks.push(deletedBook) // Додаємо в масив видалених

    res.status(200).json({
        data: deletedBook,
        error: null
    })
})

app.listen(PORT, () => {
    cl(`Server has been started: ${HOST}:${PORT}`)
})

// Отримати всі книжки
app.get('/books', (req, res) => {
    const exist_book: boolean = books.length > 0
    const title = req.query.title ? String(req.query.title) : undefined
    let our_books: BookType[] | null = null

    if (title !== undefined) {
        our_books = getBooksByTitle(title, books)
    }

    const response: BookResType = {
        data: exist_book ? (our_books !== null ? our_books : books) : null,
        error: exist_book ? null : "Books list is empty",
        status: exist_book ? 200 : 404
    };

    res.writeHead(response.status, {
        "Content-Type": "application/json"
    })
    res.end(JSON.stringify(response))
})