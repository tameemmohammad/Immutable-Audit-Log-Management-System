const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const secretCode = "MDT############009"

const app = express()
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/test-db").
    then(()=>{console.log("Database Connected")}).
    catch((err)=>{console.log(err)})
//user creation

const userSchema = mongoose.Schema({
    firstname:String,
    lastname:String,
    username:String,
    password:String,
    age:Number,
    email:String,
    bio:String,
    role:String
    
    
})


const requestSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: String,
    requestedOn: {
        type: Date,
        default: Date.now
    },
    actionTakenOn: Date,
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    requestedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
})


const User = mongoose.model("User",userSchema)
const Request = mongoose.model("Request",requestSchema)

function auth(req, res, next){
    const authorization = req.headers.authorization;
    if(!authorization){
        return res.json({"message": "Authorization is missing"});
    }
    try{
        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, secretCode);

        req.user = req.user
        next()
    }catch(err){
        console.log(err);
        return res.json({"message": "Token is invalid or expired"});
    }
}





app.post("/users/signup",
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
            bio:bio
        })

        await user.save()
        res.json({"message":"success"})
    }
)








app.post('/change-request/create', auth, async (req, res) => {
        const title = req.body.title;
        const description = req.body.description;
        const requestedTo = req.body.requestedTo;
        
        if (!title || !description || !requestedTo) {
            return res.json({"message": "Title, Description and RequestedTo are required"});
        }
    const request = Request({
            title: title,
            description: description,
            status: "pending",
            requestedBy: req.user,
            requestedTo: requestedTo
        })
        await request.save();
        // console.log(authorizationHeader);
        return res.json({"message": "Token is valid"});
})




app.post('/change-request/my-requests',auth,  async (req, res) => {
    const requests = await Request.find({requestedBy: req.user})
    res.json({"requests": requests})
})





app.post('/change-request/my-pending-requests',auth,  async (req, res) => {
    const requests = await Request.find({requestedBy: req.user,status: "pending"})
    res.json({"requests": requests})
})




app.post('/change-request/manager-my-requests',auth,  async (req, res) => {
    const requests = await Request.find({requestedTo: req.user})
    res.json({"requests": requests})
})




app.post('/change-request/manager-my-pending-requests',auth,  async (req, res) => {
    const requests = await Request.find({status: "pending", requestedTo: req.user})
    res.json({"requests": requests})
})











app.post("/users/login",async (req, res) => {
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
        secretCode,
        {expiresIn:"1h"}
    )
    return res.json({message:"Login Successful", token:token})
})

app.listen(3000)