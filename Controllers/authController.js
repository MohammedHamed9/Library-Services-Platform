const express = require('express');
const catchAsync=require('../utils/catchAsync');
const User = require('../models/userModel');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
const appError = require('../utils/appError');
    dotenv.config({path:'./config'});
    const crypto=require('crypto');
exports.signUp=catchAsync(async(req, res,next) => {
    const newUser=await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        role:req.body.role,
        passwordChangedAt:req.body.passwordChangedAt
    });
    res.status(200).json({
        status:'Your request to sign up is waiting to be approved',
        newUser
    });
});

//login function
exports.login=catchAsync(async(req, res,next) => {
    if(!req.body.email||!req.body.password)
    next(new appError('please enter your email and your password'));

    const user=await User.findOne({email:req.body.email}).select('+password');

    if(!user||!await user.checkThePassword(user.password,req.body.password)){
    next(new appError('incorrect email or password',400));}
    
    if(user.status=='in-active'){
    return res.status(202).json({
        message:"your requset to signUp is not approved yet"
    });
}
    const token=jwt.sign({id:user._id},process.env.JWT_SECRECT,{expiresIn:process.env.JWT_EXPIRED_AT});
    res.cookie('jwt',token,{
        secure:true,
        httpOnly:true
    })
    res.status(200).json({
        status:'success',
        token
        });
});
exports.protected=catchAsync(async(req,res,next)=>{
    if(!req.headers.authorization||!req.headers.authorization.startsWith('Bearer'))
    next(new appError('you are not loged in please log in to use this route!',401));
    
    let token =req.headers.authorization.split(' ')[1];
    const decoded=jwt.verify(token,process.env.JWT_SECRECT); 
    const currentUser=await User.findById(decoded.id);
    if(!currentUser)
    next(new appError('The user with this token is not longer exist!',401));
    if(currentUser.checkForChangedPass(decoded.iat))
    next(new appError('You changed your password!,please log in again',401));
    req.user=currentUser;
    next();
});

exports.resrectedTo=(...roles)=>{
return (req,res,next)=>{
    if(!roles.includes(req.user.role))
    next(new appError('U DONT HAVE THE PERMITON FOR THIS ROUTE!',401));
    
    next();
}
}
exports.forgetPassword=catchAsync(async(req,res,next)=>{
    if(!req.body.email){
        next(new appError('Please provide your email',500))
    }
    const user=await User.findOne({email:req.body.email});
    if(!user)next(new appError('This user is not found!',404));
    const restToken=user.createRestToken();
    await user.save({validateBeforeSave:false});
    res.status(200).json({
        message:'Here is your rest token',
        token:restToken
    });
})
exports.resetPassword=catchAsync(async(req,res,next)=>{
    const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
    if(!hashedToken)
    next(new appError('Please provide your rest token',400));
    const user=await User.findOne({passwordRestToken:hashedToken,passwordRestExpired:{$gt:Date.now()}})
    if(!user)
    next(new appError('The token is wrong or it Expired',401));
    user.password=req.body.password;
    user.passwordConfirm=req.passwordConfirm;
    user.passwordRestExpired=undefined;
    user.passwordRestToken=undefined;
    await user.save();

    const token=jwt.sign({id:user._id},process.env.JWT_SECRECT,{expiresIn:process.env.JWT_EXPIRED_AT});
    res.status(200).json({
        status:'success',
        message:'password reseted successfully',
        token
    });

});
exports.updatePassword=catchAsync(async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    const correctPass= await user.checkThePassword(user.password,req.body.currentPassword);
    if(!correctPass)
    next(new appError('the current password is wrong',400));
    user.password=req.body.newPassword
    user.passwordConfirm=req.body.newPasswordConfirm
    await user.save();
    const token =jwt.sign({id:user._id},process.env.JWT_SECRECT,{expiresIn:process.env.JWT_EXPIRED_AT})
    res.status(200).json({
            status:'success',
            message:'password updated successfully',
            token
        });
    })
