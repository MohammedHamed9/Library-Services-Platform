const catchAsync =require('../utils/catchAsync');
const User=require('../models/userModel');
const Book=require('../models/bookModel');
const Request=require('../models/requsetModel');

const appError = require('../utils/appError');
const filterObject=(bodyObj,...allowedFeilds)=>{
    let newObj={}
    Object.keys(bodyObj).forEach(el=>{
        if(allowedFeilds.includes(el))
        newObj[el]=bodyObj[el]
    });
    return newObj;
}
exports.getAllReqToSignUp=catchAsync(async(req,res,next)=>{
    const users= await User.find({status:'in-active'});
    if(users.length==0){
        return res.status(200).json({
            message:'there is no requests to sign up'
        })
    }
    res.status(200).json({
        data:users
    })
});
exports.manageSignUp=catchAsync(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user)
    return next(new appError('This user is not found!',404));
    else{
        user.status='active'
        await user.save({validateBeforeSave:false});
    res.status(200).json({
        message:'updated successflly',
        user
    });
}
});
exports.getUser=catchAsync(async(req,res,next)=>{
    const user=await User.findById(req.params.id).populate({path:'assignedBooks',select:'-available -description -price -rack_number '});
    if(!user)
    return next(new appError('this user is not found!',404));
    
    res.status(200).json({data:user});
});
exports.getAllUsers=catchAsync(async(req,res,next)=>{
    const users=await User.find().populate({path:'assignedBooks',select:'-available -description -price -rack_number '});
    res.status(200).json({data:users});
});
exports.updateUser=catchAsync(async(req,res,nexr)=>{
    const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:false});
    if(!user)
    return next(new appError('this user is not found!',404));
    
    res.status(200).json({
        data:user
    })
})
exports.deleteUser=catchAsync(async(req,res,nexr)=>{
    const user=await User.findByIdAndDelete(req.params.id);
    if(!user)
    return next(new appError('this user is not found!',404));
    
    res.status(200).json({
        message:'deleted successfully '
    })
});
exports.updateMe=catchAsync(async(req,res,next)=>{
    if(req.body.password)
    return next(new appError('This route is not to update the password please use the right route for this action',400));
    
    const filteredObject=filterObject(req.body,'name','email');
    const user=await User.findByIdAndUpdate(req.user.id,filteredObject,{new:true,runValidators:false});
    res.status(200).json({
        message:'updated successfully',
        data:user
    });
});
exports.deleteMe=catchAsync(async(req,res,next)=>{
    const user=await User.findByIdAndDelete(req.user.id,{status:'in-active'});
    res.status(204).json({
        message:'deleted successfully',
    });
});

exports.ReqToBorrow=catchAsync(async(req, res,next) => {
    //check on book
    const book=await Book.findOne({name:req.body.book});
    if(!book)
    return next(new appError('this book is not found!',404));
    if(book.available==false)
    return next(new appError('sorry this book is not available to borrow',404));
    const user=await User.findById(req.body.user);
    if(user.assignedBooks.length > 5)
    return next(new appError('sorry You have exceeded the allowed limit to borrow books',401));
    //create the req
    const request= await Request.create({book:book._id,user:req.body.user})
    res.status(201).json({
        status:'Your request has been sent sucessfuly',
        request
    });
});
exports.getAllReqToBorrow=catchAsync(async(req,res,next)=>{
    const requests=await Request.find();
    res.status(200).json({
        data:requests
    });
})
exports.approveBorrowReqs=catchAsync(async(req,res,next)=>{
    //check if request still exit
    const borrowReq=await Request.findById(req.params.id);
    if(!borrowReq)
    return next(new appError('this request is not found!',404));
    //check if user still exit
    const user=await User.findById(borrowReq.user._id);
    if(!user)
    return next(new appError('the user that has sent the request no longer exist!',404));
    //check if book still exit
    const book=await Book.findById(borrowReq.book._id);
    if(!book ||book.available==false )
    return next(new appError('this book is not available right now!',404));
    //assign user to the book
    book.assignedTo=user._id
    book.available=false
    await book.save({validateBeforeSave:false});
    //apporve request
    borrowReq.approved=true
    borrowReq.returnDate=req.body.returnDate
    await borrowReq.save({validateBeforeSave:false});
    
    res.status(200).json({
        message:'the request approved successfully',
        borrowReq
    })

})

