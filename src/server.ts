import express, { Request } from "express"
import "dotenv/config"
import router from "./routes/bookRoutes.js"
import path from "node:path"
import ejs from "ejs"

const cl = console.log
const PORT = process.env.PORT || 3200
const HOST = process.env.HOST || "http://localhost"

const app = express()
app.use(express.static("public"))
app.use(express.json()) //body -> json
//middleware - попередній обробник

app.set("view engine", ejs);
app.set("views", path.join(__dirname, "../views"));

app.get('/', (req,res)=>{
res.render("pages/home")
})

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