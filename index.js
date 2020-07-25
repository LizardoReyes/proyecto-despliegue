const express = require("express")
const helmet = require('helmet');
const compression = require('compression');
const path = require("path")
const app = express()
const {v4: uuidv4} = require("uuid")

require("dotenv").config()
app.use(helmet())
app.use(compression())
app.use(express.static(path.join(__dirname, "public")))

app.get("/api/uuid", (req, res) => {
    res.status(200).json(uuidv4())
})

app.get("*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"))
})

app.listen(process.env.HTTP_PORT, process.env.IP, e => {
    if (e) throw e
    console.log(`Servidor en ${process.env.IP}:${process.env.HTTP_PORT}`)
})