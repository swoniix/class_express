import express, { Request } from "express"
import "dotenv/config"
import router from "./routes/bookRoutes.js"

const cl = console.log
const PORT = process.env.PORT || 3200
const HOST = process.env.HOST || "http://localhost"

const app = express()
app.use(express.json()) //body -> json
//middleware - попередній обробник

app.use("/books", router)
app.get('/',(req,res)=>{
    res.writeHead(200,{
        "Content-Type":"text/html"
    })
    res.end("<h2>Hello from express</h2>")
})

app.listen(PORT, ()=>{
    cl(`Server has been started ${HOST}:${PORT}`)
})