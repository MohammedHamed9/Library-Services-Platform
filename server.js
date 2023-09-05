const app=require('./app');
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'});   
const mongoose=require('mongoose'); 

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then((con) => {
  /*console.log(con.connections);just to show more info about connection */
  console.log("DB CONNECTED SUCCESFULLY...");
});

app.listen(8000, () => {
    console.log("The App is runing");
});