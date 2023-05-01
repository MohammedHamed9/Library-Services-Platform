const express=require('express');
const app = new express();
const path = require('path');
const connection = require('./db/connection');
const auth=require('./routes/auth');
const bookRouter=require('./routes/bookRouter');
//middlewares
app.use(express.json());//to accesss row +json in postman
app.use(express.urlencoded({ extended: true }));//to accesss www-urlencoded in postman

//End points     

app.use('/book',bookRouter);
app.use('/auth',auth);

app.listen(3000, () => {
    console.log("App is runing");
});
