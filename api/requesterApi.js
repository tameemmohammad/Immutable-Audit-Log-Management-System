const express = require('express')
const router = express.Router()
const auth = require("../middlewares/auth")
const Request = require("../models/requestModel")


router.post('/change-request/create', auth, async (req, res) => {
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




router.get('/change-request/my-requests',auth,  async (req, res) => {
    const requests = await Request.find({requestedBy: req.user})
    res.json({"requests": requests})
})





router.get('/change-request/my-pending-requests',auth,  async (req, res) => {
    const requests = await Request.find({requestedBy: req.user,status: "pending"})
    res.json({"requests": requests})
})




router.get('/change-request/manager-my-requests',auth,  async (req, res) => {
    const requests = await Request.find({requestedTo: req.user})
    res.json({"requests": requests})
})




router.get('/change-request/manager-my-pending-requests',auth,  async (req, res) => {
    const requests = await Request.find({status: "pending", requestedTo: req.user})
    res.json({"requests": requests})
})


module.exports = router