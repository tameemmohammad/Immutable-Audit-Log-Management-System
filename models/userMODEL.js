const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstname:String,
    lastname:String,
    username:String,
    password:String,
    email:String,
    bio:String,
    role:String
})
module.exports = mongoose.model("User",userSchema)
