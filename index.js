require("dotenv").config()
const express = require("express");
const connectDB = require("./config/db")
const userApi = require("./api/userApi")
const requesterApi = require("./api/requesterApi")


const app = express()
app.use(express.json())
connectDB()

app.use("/users",userApi)
app.use("/requester",requesterApi)

app.listen(3000, ()=>{
    console.log("Server is running on 3000")
})


