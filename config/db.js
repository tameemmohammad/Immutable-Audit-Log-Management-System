const mongoose = require("mongoose");

module.exports = () => {
    mongoose.connect("mongodb://localhost:27017/test-db").
        then(()=>{console.log("Database Connected")}).
        catch((err)=>{console.log(err)})
}