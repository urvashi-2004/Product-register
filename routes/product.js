var express = require('express');
var fs=require('fs')
var router = express.Router();
var pool = require("./pool")
var upload = require('./multer')
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





router.get('/productinterface', function(req, res, next) {
  if(checkAdminSession()){
  res.render('productinterface',{status:0});
  }
  else{
    res.redirect('/admin/login')
  }
});





router.get('/fetch_all_category',function(req,res){
  
  pool.query("select * from category",function(error,result){

    if(error){
      console.log("error:",error)

       res.status(500).json({message:'Database error',status:false,data:[]}) }
    else
    {
    res.status(200).json({message:'Success',status:true,data:result}) 
    }
      })
      
 })





 router.get('/fetch_all_type',function(req,res){
  
  pool.query("select * from producttype where categoryid=?",[req.query.categoryid],function(error,result){

    if(error){
      console.log("error:",error)

       res.status(500).json({message:'Database error',status:false,data:[]}) }
    else
    {
    res.status(200).json({message:'Success',status:true,data:result}) 
    }
      })
      
 })





 router.post('/product_submit',upload.single("productpicture"),function(req,res) {
    pool.query("insert into products(productname, categoryid, producttypeid, packaging, quantity,weight, weighttype, price, offerprice, productpicture) values(?,?,?,?,?,?,?,?,?,?)",[req.body.productname, req.body.categoryid, req.body.producttypeid, req.body.packaging, req.body.quantity, req.body.weight, req.body.weighttype, req.body.price, req.body.offerprice, req.file.filename],function(error,result){
      if(error){
            res.render('productinterface',{status:1})
          }
          else{
            console.log('result',result)
            res.render('productinterface',{status:2})
          }

      })

 })


 


 router.get('/displayallproducts', function(req, res, next) {

  if(checkAdminSession()){
  pool.query("select p.*,(select c.categoryname from category c where c.categoryid=p.categoryid) as categoryname, (select pt.producttype from producttype pt where pt.producttypeid=p.producttypeid) as producttype from products p",function(error,result){
    if(error){
           res.render('displayallproducts',{data:[]})
    }
    else{
      console.log(result)
      res.render('displayallproducts',{data:result})
    }
  })
}
else{
  res.redirect('/admin/login')
}

});

 




router.get('/editproduct', function(req, res, next) {

  pool.query("select p.*,(select c.categoryname from category c where c.categoryid=p.categoryid) as categoryname, (select pt.producttype from producttype pt where pt.producttypeid=p.producttypeid) as producttype from products p where p.productid=?",[req.query.pid],function(error,result){
    if(error){
// console.log(error)
           res.render('editproduct',{data:[]})
    }
    else{
         console.log(result)
      res.render('editproduct',{data:result[0]})
    }

  })

}) 





router.post('/product_edit_data', function(req, res, next) {

  console.log("body",req.body)

  if(req.body.btn=="Edit"){

  pool.query("update products set productname=?, categoryid=?, producttypeid=?, packaging=?, quantity=?, weight=?, weighttype=?, price=?, offerprice=? where productid=?",[req.body.productname, req.body.categoryid, req.body.producttypeid, req.body.packaging, req.body.quantity, req.body.weight, req.body.weighttype, req.body.price, req.body.offerprice, req.body.productid],function(error,result){

    if(error){
      console.log("error",error)
      res.redirect('displayallproducts')
    }
    else{
      res.redirect('displayallproducts')
    }

  })

 }

 else{

  pool.query("delete from products where productid=?",[req.body.productid],function(error,result){

    if(error){
      console.log("error",error)
      res.redirect('displayallproducts')
    }
    else{
      res.redirect('displayallproducts')
    }

  })
  
 }

})





router.get('/editpicture', function(req, res, next) {
console.log(req.query)
  res.render('editpicture',{data:req.query})

})





router.post('/edit_product_picture',upload.single('productpicture'), function(req, res, next) {
  
  pool.query("update products set productpicture=? where productid=?",[req.file.filename,req.body.pid],function(error,result){
    
    if(error){
      console.log("error",error)
      res.redirect('displayallproducts')
    }
    else{
      fs.unlinkSync(`/public/images/${req.body.oldpicture}`)
      res.redirect('displayallproducts')
    }

  })
  
  })




  


module.exports = router;
