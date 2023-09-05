const mongoose=require('mongoose');
const requsetSchema=new mongoose.Schema({
    book:{
        type:mongoose.Schema.ObjectId,
        ref:'books',
        required:[true,'the requset must has a book']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'users',
        required:[true,'the requset must has a user']
    },
    returnDate:{
        type:Date,
        default:Date.now()
    },
    approved:{
        type:Boolean,
        default:false
    },
},{
    toJSON:{virtuals:true,
        versionKey: false 
    },
    toObject:{virtuals:true}
});

requsetSchema.pre(/^find/,function(next){
    this.populate('book').populate('user');
    next()
});
requsetSchema.index({ book: 1 , user:1 }, {unique:true});

const Request=mongoose.model('requests',requsetSchema);
module.exports=Request;