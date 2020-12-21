var User = require("../model/User")

module.exports.aulogin = function (req, res, next) {
    if (!req.cookies.userID && !req.cookies.standedID) {
        res.redirect("/login")
        return;
    } next();
        
}
module.exports.aulogined = function (req, res, next) {
    if (req.cookies.userID || req.cookies.standedID ) {
        res.redirect("/admin")
        return;
    } 
    next();
        
}
module.exports.auTypeUser = function (req, res, next) {
    if(req.cookies.standedID){
        req.flash('message', 'The Function are  Admin just');
        res.redirect("/admin")
        return;
    } next();   
}

