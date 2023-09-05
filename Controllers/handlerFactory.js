const catchAsync=require('../utils/catchAsync');
const APIFeature=require('../utils/apiFeaturse');
const appError = require('../utils/appError');

exports.createOne=(Model)=>{
return catchAsync(async(req, res,next) => {
    const doc=await Model.create(req.body);
    res.status(201).json({
        message:'created successfully',
        data:doc});
}
)
}
exports.updateOne=(Model)=>{
return catchAsync(async(req, res,next) => {
    const doc=await Model.findByIdAndUpdate(req.params.id,req.body,
        {new:true,runValidators:true});
        if(!doc)
        return next(new appError('this documnet is not found!',404));
        
        res.status(200).json({data:doc});
    
});
}
exports.deleteOne=(Model)=>{
    return catchAsync(async(req, res,next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if(!doc)
        return next(new appError('this documnet is not found!',404));
        
        res.status(204).json({message:'the document deleted successfully'});
    
});
}
exports.getAllDocs=(Model)=>{
return catchAsync(async(req, res,next) => {
    const features=new APIFeature(Model.find(),req.query);
    features.filter().sort().limitFields().paginate();
    const docs=await features.query;
    res.status(200).json({data:docs});
});
}
exports.getADoc=(Model)=>{
return catchAsync(async(req, res,next) => {
    const doc=await Model.findById(req.params.id);
    if(!doc)
        return next(new appError('this documnet is not found!',404))
    res.status(200).json({
        data:doc
    });
});
}