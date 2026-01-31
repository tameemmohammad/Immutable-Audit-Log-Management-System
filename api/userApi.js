
require("dotenv").config()
const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/userMODEL")

const router = express.Router()

router.post("/signup",
    async(req,res)=>{
        const firstname=req.body.firstname
        const lastname=req.body.lastname
        const username=req.body.username 
        const password=req.body.password
        const email=req.body.email
        const bio=req.body.bio
        const role=req.body.role

        if(!email || !password){
            return res.json({"message":"invalid request"})
        }
        if (password.length<=8){
            return res.json({"message":"password should be minimum 8 characters"})
        }

        const userCheck = await User.findOne({email:email})
        if(userCheck){
            return res.json({"message":"user already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,10)

        const user = new User({
            firstname:firstname,
            lastname:lastname,
            username:username,
            password:hashedPassword,
            email:email,
            bio:bio,
            role:role
        })

        await user.save()
        res.json({"message":"success"})
    }
)


router.post("/login",async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return res.json({"message":"Email is invalid"})
    }
    const isPasswordMatching = await bcrypt.compare(req.body.password, user.password)
    if(!isPasswordMatching){
        return res.json({"message":"Password is invalid"})
    }
    const token = jwt.sign(
        { user:user._id},
        process.env.secret_code,
        {expiresIn:"1h"}
    )
    return res.json({message:"Login Successful", token:token})
})


module.exports = router