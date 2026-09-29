import express, { Request, Response } from "express"
import "dotenv/config"
import router from "./routes/bookRoutes.js"
import path from "node:path"
import ejs from "ejs"
import expressEjsLayouts from "express-ejs-layouts"
import { fileURLToPath } from "node:url"
import { loggerMiddleware } from "./middlewares/loggerMiddleware.js"
import authMiddleware from "./middlewares/authMiddleware.js"
import cookieParser from "cookie-parser"
import { error } from "node:console"
import { request } from "node:http"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cl = console.log
const PORT = process.env.PORT || 3200
const HOST = process.env.HOST || "http://localhost"

const app = express()

app.use(cookieParser());
app.use(authMiddleware);
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, "..", "public")))
app.use(express.json()) //body -> json
app.use(loggerMiddleware);
// //middleware - попередній обробник

app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");
app.use(expressEjsLayouts);
app.set("layout", path.join(__dirname, "..", "views", "layouts", "main"));


// ---- .COOKIES. ----
app.get("/cookie", (req: Request, res: Response) => {
    res.cookie("username", "KYKA", {
        httpOnly: true,
        maxAge: 2 * 60 * 1000, //2хв
    });

    res.cookie("email", "kyka@gmail.com")
    res.send("Cookie created");
});

app.get("/cookie-read", (req: Request, res: Response) => {
    if (req.cookies && req.cookies.username) {
        res.send(`Welcome, ${req.cookies.username}`);
    } else {
        res.send(`Welcome, guest`);
    }
});
app.get("/cookie-remove", (req: Request, res: Response) => {
    if (req.cookies && req.cookies.username) {
        res.clearCookie("username");
        res.send(`Removed cookie`);
    } else {
        res.send(`Cookie not found`);
    }
});
//hw cookie login
app.get("/login", (req: Request, res: Response) => {
    res.render("pages/login", { // html-page
        title: "Login",
        error: null
    })
})
app.post("/login", (req: Request, res: Response) => {
    const username = req.body.username
    const password = req.body.password

    if (username === "admin" && password === "1234") {
        res.cookie("username", username, {
            httpOnly: true, //фронт не бачит
            maxAge: 24 * 60 * 60 * 1000, //время жизни куки
            sameSite: "lax", //защита от куки с постороних сайтов
            path: "/", //действует на всех страницах
        })
        res.redirect("/")
        return
    }
    res.status(401).render("pages/login", {
        title: "Login",
        error: "Incorrect user or password",
    });
})
//logout 
app.post("/logout", (req: Request, res: Response) => {
    res.clearCookie("username", {
        path: "/"
    })
    res.redirect("/")
})


app.get('/', (req: Request<null, null, null, { title: string }>, res) => {
    res.render("pages/home", {
        title: "Home",
        name: req.query.title || "Guest"
    })
})

app.use("/books", router)
//  app.get('/',(req,res)=>{
//      res.writeHead(200,{
//          "Content-Type":"text/html"
// //     })
// //     res.end("<h2>Hello from express</h2>")
// // })

app.listen(PORT, () => {
    cl(`Server has been started ${HOST}:${PORT}`)
})
