var express = require('express');
var router = express.Router();
var pool=require('./pool')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('/.scratch');



function checkAdminSession(){
    try{
      var admin=JSON.parse(localStorage.getItem('ADMIN'))
      if(admin==null){
        return false
      }
      else{
        return admin
      }
      console.log(admin)
    }
    catch(e){
       return false
    }
  }




router.get('/login', function(req, res, next) {
    var data=checkAdminSession()
    if(data){
        res.render('dashboard',{userdata:data})
    }
    else{
        res.render('login',{msg:''})
    }
})




router.get('/logout', function(req, res, next) {
    localStorage.clear()
    res.redirect('/admin/login')
})




router.get('/dashboard', function(req, res, next) {
    res.render('dashboard',{msg:''})
})





router.post('/checklogin', function(req, res, next) {
    
    pool.query('select * from admins where (email=? or mobileno=?) and password=?',[req.body.email,req.body.email,req.body.password],function(error,result){
 
        if(error){
            console.log(error)
            res.render('login',{msg:'database error'})
        }

        else{
            if(result.length==1){
                res.render('dashboard',{userdata:result[0]})
                localStorage.setItem('ADMIN',JSON.stringify(result[0]))
            }
            else{
            res.render('login',{msg:'invalid emai/password'})
            }
        }

    })

})

module.exports = router;
