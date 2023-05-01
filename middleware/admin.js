const connection = require('../db/connection');
const forAdmin=(req,res,next)=>{
    const token=req.headers.token;
    connection.query('select * from users where token = ?',token,(err, results, fields)=>{
        if(err)
        console.log(err);
        if(results.length>0&&results[0].role==1){
            next();
        }
        else{
            res.status(500).json({message:"your are not authorized to access this router"});
        }
    });
}
module.exports=forAdmin;