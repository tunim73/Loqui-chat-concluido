/*function auth (req, res, next){

    if(req.session.user!=undefined){
        next(req.session.user.user);
    }
    else {
        res.redirect("/");
    }
}
    */

function auth (req, res, next){

    if(req.session.user!=undefined){
        next();
    }
    else {
        res.redirect("/");
    }
}




module.exports = auth;