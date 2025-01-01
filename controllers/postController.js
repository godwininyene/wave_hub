const catchAsync = require('./../utils/catchAsync');
// const Post = require('./../models/postModel')
const Post = require('./../models/Post')
const User = require('./../models/User')
const Category = require('../models/Category');
const Comment = require('./../models/Comment')
const AppError = require('./../utils/appError')
const multer = require('multer');
const sharp = require('sharp')
const slugify = require('slugify')
const APIFeatures = require('./../utils/apiFeatures');
const functions = require('./../utils/functions')


const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    }else{
        cb(new AppError('', {coverImage:'Not an image! Please upload only images.'}, 400), false)
    }
}

const upload = multer({
    storage:multerStorage,
    fileFilter:multerFilter
})

exports.uploadCoverPhoto =  upload.single('coverImage');
exports.uploadExtra = upload.single('upload');
exports.resizeCoverPhoto = catchAsync(async(req, res, next)=>{
    if(!req.file) return next();

    req.file.filename = `cover-image-${Date.now()}.jpeg`
    await sharp(req.file.buffer)
    .resize(650, 350, { fit: 'inside' })
    .toFormat('jpeg')
    .jpeg({quality: 60})
    .toFile(`public/images/posts/${req.file.filename}`)

    next();

});

exports.aliasPopularPosts = (req, res, next)=>{
    req.query.limit = '5';
    req.query.sort='-viewCount,-commentCount'
    req.query.fields='title,coverImage,createdAt,viewCount,commentCount,slug'
    next();
}

exports.aliasRecentPosts = (req, res, next)=>{
    req.query.limit = '5';
    req.query.sort='-createdAt'
    req.query.fields='title,coverImage, createdAt ,viewCount ,commentCount,slug'
    next();
}

exports.createPost = catchAsync(async(req, res, next)=>{

    // req.body.author = req.user._id;
    req.body.authorId = req.user.id;
 
    if(req.file) req.body.coverImage = req.file.filename;
   
    const post = await Post.create(req.body)
    res.status(200).json({
        status:"success",
        data:{
            post
        }
    })
});


exports.getAllPosts = catchAsync(async(req, res, next) =>{
    //EXECUTE THE QUERY
    // const features = new APIFeatures(Post.find(), req.query)
    // .filter()
    // .sort()
    // .limitFields()
    // .paginate()
    // const posts = await features.query;

    // Initialize APIFeatures with query params
    const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

    // Execute the query with the options
    const posts = await Post.findAll(features.getOptions());
   
    //Send Response
    res.status(200).json({
        status:"success",
        result:posts.length,
        data:{
            posts
        }
    })
});

exports.getPost = catchAsync(async(req, res, next)=>{
    // const post = await Post.
    //     findById(req.params.id)
    //     .populate({path:'comments', select:'comment author createdAt'})
    //     .populate({path:"author", select:'name authorSlug'})
    //     .populate({path:'category', select:'name'});

    

    // //Update viewers
    // await Post.findById(req.params.id, {
    //     $addToSet:{viewers: req.connection.remoteAddress},
    //     // $inc:{viewCount: 1}
    // },{
    //     new:true
    // })

    // Step 1: Get post with populated author, comments, and category
    let post = await Post.findByPk(req.params.id,{
        include:[
            {
                model:User,
                as:'author',
                attributes:['name', 'id']
            },
            {
                model:Category,
                as:'category',
                attributes:['name', 'id']
            },
            {
                model: Comment,
                as:'comments',
                attributes:['comment', 'author', 'createdAt']
            }
        ]
    });

    
    if(!post){
        return next(new AppError('No post was found with that ID', '', 404));
    }

    // Step 2: Update viewers array and increment view count
    functions.hasUserViewedPost(req, post.id)
   
    res.status(200).json({
        status:"success",
        data:{
            post
        }
    })
});

exports.updatePost = catchAsync(async(req, res, next)=>{
    if(req.file) req.body.coverImage = req.file.filename;
    // req.body.slug = slugify(req.body.title, {lower: true})
    // const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    //     runValidators:true,
    //     new:true
    // });

    // const [rowsUpdated] = await Post.update(req.body, {
    //     where: { id: req.params.id },
    //     validate: true
    // });

    // if(!rowsUpdated){
    //     return next(new AppError('No post was found with that ID', '', 404));
    // }
    // // Re-fetch the updated post
    // const updatedPost = await Post.findByPk(req.params.id);

    // Fetch the post instance first to trigger hooks
    const post = await Post.findByPk(req.params.id);
    if (!post) {
        return next(new AppError('No post was found with that ID', '', 404));
    }

    // Update the post's properties and save it
    const updatedPost = await post.update(req.body, { validate: true});
    res.status(200).json({
        status:"success",
        data:{
            post:updatedPost
        }
    })
});

exports.deletePost = catchAsync(async(req, res, next)=>{
    // const post = await Post.findByIdAndDelete(req.params.id)
    const post = await Post.findByPk(req.params.id);

    if(!post){
        return next(new AppError("No post was found with that ID", '', 404))
    }

    // Delete the post
    await post.destroy();
    res.status(204).json({
        status:"success",
        data:null
    })

})

