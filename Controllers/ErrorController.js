const appError = require("../utils/appError");
sendError=(err,req,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack
    });
    console.log(err);
}
module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.status=err.status||'error';
    sendError(err,req,res);
}