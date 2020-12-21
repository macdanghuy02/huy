var mongoose = require("mongoose");

var schemapass = new mongoose.Schema({
    _id: String,
    username: String,
    password: String,
    type: String,
    loginid: String
});
module.exports = mongoose.model("User", schemapass );