const mongoose=require('mongoose');
const { stringify } = require('querystring');
const validator=require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        maxlength:[40,'the maximum length for your name is 40 characters']
    },
    email:{
        type:String,
        required:[true,'Email address is required'],
        unique:true,
        trim:true,
        lowercase:true,
        validate:[validator.isEmail,'PLEASE ENTER A VALID EMAIL!']
    },
    password:{
        type:String,
        required:'the password is required',
        select:false
    },
    passwordConfirm:{
        type:String,
        required:'please confirm your password',
        validate:{
            validator:function(){
                return this.password===this.passwordConfirm
            },
            message:'Passwords are not the same'
        }
    },
    passwordChangedAt:Date,
    passwordRestToken:String,
    passwordRestExpired:Date,
    role:{
        type:String,
        trim:true,
        enum:['user','admin','librarian'],
        default:'user'
    },
    status:{
        type:String,
        trim:true,
        enum:['active','in-active'],
        default:'in-active',
    },
   
},
{
    toJSON: { 
        virtuals:true,
        versionKey: false 
      },
      toObject:{
        virtuals:true
      }
});
userSchema.pre('save',async function(next){
    if(!this.isModified('password'))return next();  
    this.password=await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined
    next();
});
userSchema.virtual('assignedBooks',{
    ref:'books',
    foreignField:'assignedTo',
    localField:'_id'
    
});
userSchema.methods.checkThePassword= async function(truePass,userPass){
    const passCorrectness=await bcrypt.compare(userPass,truePass);

    return passCorrectness;
}

userSchema.methods.checkForChangedPass=function(JwtTimeStamp){
    if(this.passwordChangedAt){
        this.passwordChangedAt=this.passwordChangedAt.getTime()/1000;
        return this.passwordChangedAt>JwtTimeStamp
    }

    return false;
}
userSchema.methods.createRestToken=function(){
    const restToken=crypto.randomBytes(32).toString('hex');
    this.passwordRestToken=crypto
    .createHash('sha256')
    .update(restToken)
    .digest('hex');
    this.passwordRestExpired=Date.now()+10*60*1000
    return restToken;
    
}
const User=mongoose.model('users',userSchema);
module.exports=User;