const express=require('express');
const router = express.Router();
const authController=require('../Controllers/authController');
const userController=require('../Controllers/userController');
router.post('/login',authController.login);
router.post('/signUp', authController.signUp);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token',authController.resetPassword);
router.patch('/updatePassword',authController.protected,authController.updatePassword)
router.get('/reqsToSignUp',authController.protected,userController.getAllReqToSignUp)
router.patch('/manageSignUp/:id',authController.protected,authController.resrectedTo('admin'),userController.manageSignUp);
router.get('/getUser/:id',authController.protected,authController.resrectedTo('admin'),userController.getUser);
router.get('/getAllUsers',authController.protected,authController.resrectedTo('admin'),userController.getAllUsers);
router.patch('/updateUser/:id',authController.protected,authController.resrectedTo('admin'),userController.updateUser);
router.delete('/deleteUser/:id',authController.protected,authController.resrectedTo('admin'),userController.deleteUser);
router.patch('/updateMe',authController.protected,authController.resrectedTo('user'),userController.updateMe);
router.delete('/deleteMe',authController.protected,authController.resrectedTo('user'),userController.deleteMe);
router.post('/ReqToBorrow',authController.protected,userController.ReqToBorrow);
router.get('/getAllReqToBorrow',authController.protected,authController.resrectedTo('admin'),userController.getAllReqToBorrow);
router.patch('/approveBorrowReqs/:id',authController.protected,authController.resrectedTo('admin'),userController.approveBorrowReqs);




module.exports=router;