const express = require("express");
const router = express.Router();
let settings = require("../../config/settings.json");
const bcrypt = require("bcrypt-nodejs");
//Check if user is admin
function checkAdmin(req,res,site, data){
    if(req.session.user.isAdmin){
        res.render('./settings/'+site, data);
    }
    else{
        res.render('./settings/unauthorized', data);
    }
}

router.get('/', (req,res,next) =>{
    //require the right lang
    const lang = require("../lang/"+req.session.user.lang+".json");
//the data-packed you need to render the site
    let data = {
        lang: lang,
        title: settings.title,
        user: req.session.user
    };
    //which site is going to render
   switch (req.query.site){
       case 'general':
           //Use the function
           checkAdmin(req,res,'general',data);
           break;
       default:
           //No need to check if admin, everybody can do this
           res.render('./settings/personal', data);
           break;
   }
});

//Router for language changing
router.post('/changelang', (req,res,next) => {
    //If not set, return
    if(!req.body){
        return res.send(false);
    }
    //db out of req context
    const db = req.db;
    const query = 'UPDATE users SET lang = ? WHERE userId = ?';
    const fields = [req.body.lang,req.session.user.userId];
    //set the new language in database
    db.query(query,fields, (error,results) => {
        if(error){
            return res.send(false);
        }
        res.send(true);
    });
});
module.exports = router;