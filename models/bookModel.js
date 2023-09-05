const mongoose=require('mongoose');
const BookSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"the book must has a name"],
        unique:[true,"the book name must be unique"],
        maxlength:[20,'the name of the book should be less than 20 characters'],
        minlength:[4,'the name of the book should be more than than 4 characters']
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
        required:[true,"the book must has a price"],
        validate:{
            validator:function(){
                    return this.price >= 0
            },
            message:'the price cant be less that 0'
        }
    },
    rack_number:{
        type:Number,
        min:[1,'the rack number cant less than 1'],
        max:[5,'the rack number cant exceed 5']
    },
    available:{
        type:Boolean,
        default:true
    },
    assignedTo:{
        type:mongoose.Schema.ObjectId,
        ref:'users'
    }
},{
    toJSON: { 
        versionKey: false 
    }
    });
BookSchema.pre(/^find/,function(next){
    this.populate({
        path:'assignedTo',
        select:'name email'});
    next();
})
const Book=mongoose.model('books',BookSchema);
module.exports= Book;