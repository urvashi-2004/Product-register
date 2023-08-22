var mysql=require("mysql2")
var pool=mysql.createPool({
 host:'localhost',
 port:3306,
 user:'root',
 password:'urvashi@2004',
 database:'productregister',
 connectionLimit:100,
 multipleStatements:true 
})
module.exports=pool