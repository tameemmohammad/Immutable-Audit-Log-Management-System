const jwt = require("jsonwebtoken")

module.exports =(req, res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization){
        return res.json({"message": "Authorization is missing"});
    }
    try{
        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.secret_code);

        req.user = decoded.user
        next()
    }catch(err){
        console.log(err);
        return res.json({"message": "Token is invalid or expired"});
    }
}



