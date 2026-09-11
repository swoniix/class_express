import express from "express"
import "dotenv/config"
import { BookType } from "./types/BookType.js"
import { BookResType } from "./types/bookResType.js"

const cl = console.log
const PORT = process.env.PORT || 4200
const HOST = process.env.HOST || "http://localhost"

const app = express()

// Масив книжок 
const books: BookType[] = [
    {
        id: 1,
        title: "book1",
        price: 250,
        isActive: true
    },
    {
        id: 2,
        title: "book2",
        price: 320,
        isActive: true
    },
    {
        id: 3,
        title: "book3",
        price: 400,
        isActive: true
    }
]
app.get('/books/:id', (req, res) => {
    const id: number = +req.params.id
    const book: BookType | undefined = books.find((books) => books.id === id)
    cl(book)
    let status_code: number = 200
    const response: BookResType = {
        data: null,
        error: null
    }
    if (book === undefined) {
        // res.writeHead(200, {
        //     "Content-Type": "application/json"
        // }) // res.end(JSON.stringify(books))
        status_code = 404
        response.error = "The Book not found"
    }
    else {
        status_code = 200
        response.data = book
    }
    res.writeHead(status_code, {
        "Content-Type": "application/json"
    })
    res.end(JSON.stringify(response))
})
const deletedBooks: BookType[] = []
app.delete('/books/:id', (req, res) => {
    const id: number = +req.params.id
    const bookIndex: number = books.findIndex((book) => book.id === id)

    let status_code: number = 200
    const response: BookResType = {
        data: null,
        error: null
    }

    if (bookIndex === -1) {
        status_code = 404
        response.error = "The Book not found or already deleted"
    } else {
        const deletedBook: BookType = books.splice(bookIndex, 1)[0]
        status_code = 200
        response.data = deletedBook
    }

    res.writeHead(status_code, { "Content-Type": "application/json" })
    res.end(JSON.stringify(response))
})

app.get('/deleted-books', (req, res) => {
    res.json(deletedBooks)
})

app.get('/', (req, res) => {
    res.send("<h2>Сервер працює! Перейди на /books</h2>")
})

app.get('/books', (req, res) => {
    res.json(books)
})

app.listen(PORT, () => {
    cl(`Server has been started: ${HOST}:${PORT}`)
})