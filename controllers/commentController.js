const catchAsync = require("../utils/catchAsync");
// const Comment = require('./../models/commentModel');
const Comment = require('./../models/Comment')
const AppError = require('./../utils/appError');

exports.createComment = catchAsync(async(req, res, next)=>{
    //Allowed for nested routes
    if(!req.body.postId) req.body.postId = req.params.postId;
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
    let filter = {
        order: [['createdAt','DESC']]
    };
    // if(req.params.postId) filter={post: req.params.postId}
    // const comments = await Comment.find(filter);

    if(req.params.postId) filter.where = { postId:req.params.postId }  
   
    const comments = await Comment.findAll(filter);

    res.status(200).json({
        status:"success",
        result:comments.length,
        data:{
            comments
        }
    })
})

exports.deleteComment = catchAsync(async(req, res, next)=>{
    // const comment = await Comment.findByIdAndDelete(req.params.id);
    const comment = await Comment.findByPk(req.params.id)

    if(!comment){
        return next(new AppError('No comment was found with that ID', '', 404));
    }

    //Delete Comment
    await comment.destroy()

    res.status(204).json({
        status:"success",
        data:null
    })
});

exports.updateComment = catchAsync(async(req, res, next)=>{
    // const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    //     runValidators:true,
    //     new:true
    // });
    // if(!updatedComment){
    //     return next(new AppError('No comment was found with that ID', '', 404));
    // }

    const [rowsUpdated] = await Comment.update(req.body, {where: {id: req.params.id}});

    if(!rowsUpdated){
        return next(new AppError('No comment was found with that ID', '', 404));
    }
    const updatedComment = await Comment.findByPk(req.params.id)

    res.status(200).json({
        status:"success",
        data:{
            comment:updatedComment
        }
    })
})