const express = require("express")
const helmet = require('helmet');
const compression = require('compression');
const fs = require("fs");
const http = require("http")
const https = require("https")
const path = require("path")
const app = express()
const cors = require("cors")
const {v4: uuidv4} = require("uuid")
require("dotenv").config()

console.log(process.env.KEY_PATH, process.env.CERT_PATH)

const httpsServerOptions = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH)
}

app.use(helmet())
app.use(compression())
app.use(cors())

// Para redireccionar el http a https
app.use((req, res, next) => {
    if (req.secure) {
        next();
    } else {
        res.redirect(301, `https://${req.headers.host}${req.url}`)
    }
})

app.use(express.static(path.join(__dirname, "public")))

app.get("/api/uuid", (req, res) => {
    res.status(200).json(uuidv4())
})

app.get("*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"))
})

const serverHttp = http.createServer(app)
serverHttp.listen(process.env.HTTP_PORT, process.env.IP)

const serverHttps = https.createServer(httpsServerOptions, app)
serverHttps.listen(process.env.HTTPS_PORT, process.env.IP)
