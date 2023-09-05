const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const fs=require('fs');
const bookModel = require('../models/bookModel');
mongoose.connect(process.env.DB,{
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then((con)=>{
    console.log('database connected successfully...')
});
const books=JSON.parse(fs.readFileSync(`${__dirname}/books.json`,'utf-8'));
const importData=async()=>{
    try{
    await bookModel.create(books);
    console.log("the books created successfully");
    
}catch(err){
    console.log(err);
}
process.exit();

};
const deleteData=async()=>{
    try{
    await bookModel.deleteMany();
    console.log("the books deleted successfully");
    
}catch(err){
    console.log(err);
}
process.exit();

};
if(process.argv[2]=='--import'){
    importData();
}
else if(process.argv[2]=='--delete'){
    deleteData();
};