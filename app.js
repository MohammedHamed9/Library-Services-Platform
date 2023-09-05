const express = require('express');
const app = new express();
const userRouter = require('./routes/userRouter');
const bookRouter = require('./routes/bookRouter');
const appError = require('./utils/appError');
const ErrorController=require('./Controllers/ErrorController');
//middlewares
app.use(express.json());//to accesss row +json in postman
app.use(express.urlencoded({ extended: true }));//to accesss www-urlencoded in postman

//End points     

app.use('/book', bookRouter);
app.use('/user', userRouter);

app.all('*',(req,res,next)=>{
    const err=new appError(`cant find ${req.originalUrl} in this server`,404);
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message
    });
});
app.use(ErrorController);
module.exports=app
