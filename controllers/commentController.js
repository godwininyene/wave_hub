const catchAsync = require("../utils/catchAsync");
const Comment = require('./../models/commentModel');
const AppError = require('./../utils/appError');

exports.createComment = catchAsync(async(req, res, next)=>{
    //Allowed for nested routes
    if(!req.body.post) req.body.post = req.params.postId;
    const comment = await Comment.create(req.body);
    res.status(200).json({
        status:"success",
        data:{
            comment
        }
    })
});

exports.getComments = catchAsync(async(req, res, next)=>{
    //Allowed for nested routes
    let filter = {};
    if(req.params.postId) filter={post: req.params.postId}
    const comments = await Comment.find(filter);

    res.status(200).json({
        status:"success",
        result:comments.length,
        data:{
            comments
        }
    })
})

exports.deleteComment = catchAsync(async(req, res, next)=>{
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if(!comment){
        return next(new AppError('No comment was found with that ID', '', 404));
    }

    res.status(204).json({
        status:"success",
        data:null
    })
});

exports.updateComment = catchAsync(async(req, res, next)=>{
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
        runValidators:true,
        new:true
    });

    if(!updatedComment){
        return next(new AppError('No comment was found with that ID', '', 404));
    }

    res.status(200).json({
        status:"success",
        data:{
            comment:updatedComment
        }
    })
})