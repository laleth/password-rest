const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
const userRoutes = require("./routes/userRoute.js")
const cors = require("cors")
const app = express()
const PORT = 5000

app.use(express.json())
app.use(cors({}))
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.send("Welcome to Password reset")
})

app.use("/users",userRoutes)

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Mongoose is connected")
        app.listen(PORT, () => console.log("Server started on the PORT", PORT))
    }
    ).catch((error) => {
        console.log(error.message)

    })